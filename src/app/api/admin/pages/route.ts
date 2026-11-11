import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getPages, createPage } from "@/lib/storage/db";

export async function GET() {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const pages = await getPages();
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const body = await req.json();
    const { title, slug, seoTitle, seoDescription, inNavigation = false } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const pages = await getPages();
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (pages.some((p) => p.slug === cleanSlug)) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
    }

    const newPage = await createPage(
      {
        slug: cleanSlug,
        title,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || "",
        isPublished: false,
        inNavigation,
        navigationOrder: pages.length + 1,
      },
      session.user.id
    );

    return NextResponse.json({ success: true, page: newPage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create page" }, { status: 500 });
  }
}
