import { NextRequest, NextResponse } from "next/server";
import {
  authenticateStaff,
  createSessionToken,
  setStaffPassword,
  getAdminSession,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/storage/db";
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const body = await req.json();
    const { action, email, password, newPassword } = body;

    // Handle password change action for authenticated staff
    if (action === "change_password") {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!newPassword) {
        return NextResponse.json({ error: "New password is required" }, { status: 400 });
      }

      const res = await setStaffPassword(session.user.id, newPassword);
      if (!res.success) {
        return NextResponse.json({ error: res.error || "Failed to update password" }, { status: 400 });
      }

      await recordAuditLog({
        userId: session.user.id,
        userEmail: session.user.email,
        action: "PASSWORD_CHANGED",
        entityType: "auth",
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // Rate limiting for login attempts
    const rateCheck = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check for deprecated default bootstrap passwords
    if (password === "TroyX@2026!" || password === "troyxistore") {
      await recordAuditLog({
        userEmail: email,
        action: "LOGIN_REJECTED_DEFAULT_CREDENTIALS",
        entityType: "auth",
        details: { reason: "Attempted use of deprecated default bootstrap credentials" },
        ipAddress: ip,
      });

      return NextResponse.json(
        {
          error:
            "Staff authentication setup is postponed. Default initial passwords have been permanently disabled until verified store owner credentials are provisioned in Firebase.",
        },
        { status: 401 }
      );
    }

    const user = await authenticateStaff(email, password);
    if (!user) {
      await recordAuditLog({
        userEmail: email,
        action: "LOGIN_FAILED",
        entityType: "auth",
        details: { reason: "Invalid credentials" },
        ipAddress: ip,
      });

      return NextResponse.json(
        {
          error: `Staff authentication setup is postponed or credentials invalid. ${rateCheck.remaining} attempt(s) remaining.`,
        },
        { status: 401 }
      );
    }

    // Reset rate limit on successful authentication
    resetRateLimit(ip);

    const token = createSessionToken(user);
    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "STAFF_LOGIN",
      entityType: "auth",
      details: { role: user.role, email: user.email },
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      user,
      token,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: session.user,
    customClaims: session.customClaims,
  });
}

export async function DELETE() {
  try {
    const session = await getAdminSession();
    if (session?.user?.id) {
      const { getAdminAuth } = await import("@/lib/firebase/admin");
      const adminAuth = getAdminAuth();
      if (adminAuth) {
        await adminAuth.revokeRefreshTokens(session.user.id).catch(() => {});
      }
    }
  } catch {}

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
