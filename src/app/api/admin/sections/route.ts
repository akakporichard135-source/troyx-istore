import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getPageSections, createSection } from "@/lib/storage/db";

export async function GET(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get("pageId");
  if (!pageId) {
    return NextResponse.json({ error: "pageId parameter is required" }, { status: 400 });
  }

  const sections = await getPageSections(pageId);
  return NextResponse.json({ sections });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor"]);
  if (!auth.authorized) {
    return auth.response;
  }
  const session = auth.session;

  try {
    const body = await req.json();
    const {
      pageId,
      sectionType = "cinematic_hero",
      draftLabel,
      title = "",
      subtitle = "",
      tagline = "",
      sortOrder = 99,
      isPublished = false,
      theme = "dark",
      backgroundColor = "#000000",
      textColor = "#f5f5f7",
      textAlignment = "center",
      desktopImageUrl,
      mobileImageUrl,
      desktopVideoUrl,
      mobileVideoUrl,
      posterImageUrl,
      mediaType = "none",
      learnMoreUrl,
      learnMoreText = "Learn more",
      buyUrl,
      buyText = "Buy",
      animationSettings = {},
      config = {},
    } = body;

    if (!pageId || !draftLabel) {
      return NextResponse.json(
        { error: "pageId and draftLabel are required" },
        { status: 400 }
      );
    }

    const section = await createSection(
      {
        pageId,
        sectionType,
        draftLabel: draftLabel.replace(/<[^>]*>?/gm, ""), // Sanitize XSS
        title: title ? title.replace(/<[^>]*>?/gm, "") : "",
        subtitle: subtitle ? subtitle.replace(/<[^>]*>?/gm, "") : "",
        tagline: tagline ? tagline.replace(/<[^>]*>?/gm, "") : "",
        sortOrder,
        isPublished,
        theme,
        backgroundColor,
        textColor,
        textAlignment,
        desktopImageUrl,
        mobileImageUrl,
        desktopVideoUrl,
        mobileVideoUrl,
        posterImageUrl,
        mediaType,
        learnMoreUrl,
        learnMoreText,
        buyUrl,
        buyText,
        animationSettings,
        config,
      },
      session.user.id
    );

    return NextResponse.json({ success: true, section });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create section" }, { status: 500 });
  }
}
