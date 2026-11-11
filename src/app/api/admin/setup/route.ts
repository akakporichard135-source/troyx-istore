import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

// Public registration is disabled per security specification.
// Administrator accounts must be provisioned via trusted local server administration
// (e.g. node scripts/create-temporary-owner.mjs) or by an existing authorized owner.

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Public administrator registration is permanently disabled. Administrator accounts must be provisioned via trusted local server administration.",
    },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();

  // If not authenticated as an existing owner, reject immediately
  if (!session || session.user.role !== "owner") {
    return NextResponse.json(
      {
        error:
          "Forbidden: Public registration and bootstrap endpoints are disabled. Administrator accounts require trusted local provisioning or an existing authorized owner session.",
      },
      { status: 403 }
    );
  }

  // Authorized owner creating an account
  const { provisionTemporaryOwner } = await import("@/lib/auth/temporary-owner");
  const body = await req.json();
  const { email, password, fullName, role = "editor" } = body;

  const result = await provisionTemporaryOwner({
    email,
    password,
    fullName: fullName || "Staff Account",
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed to create account" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Administrator account provisioned by authorized owner.",
    user: result.user,
  });
}
