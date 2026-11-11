import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth/session";
import { getProducts, createProduct } from "@/lib/storage/db";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const auth = await requireAdminRole(["owner", "editor", "viewer"]);
  if (!auth.authorized) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;

  const products = await getProducts({ category });
  return NextResponse.json({ products });
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
      name,
      brand = "Apple",
      model,
      category = "iphone",
      description = "",
      condition = "Brand New",
      simConfig = "Physical SIM",
      batteryHealth = null,
      isPublished = false,
      isFeatured = false,
      stockQuantity = 0,
      sku,
      basePrice,
      discountPrice = null,
      learnMorePageId = null,
      images = [],
      metadata = {},
      variants = [],
      specifications = [],
    } = body;

    if (!name || !model || !sku || basePrice === undefined) {
      return NextResponse.json(
        { error: "Name, model, SKU, and basePrice are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const product = await createProduct(
      {
        slug,
        name,
        brand,
        model,
        category,
        description,
        condition,
        simConfig,
        batteryHealth: batteryHealth ? parseInt(batteryHealth) : null,
        isPublished,
        isFeatured,
        stockQuantity: parseInt(stockQuantity) || 0,
        sku,
        basePrice: parseFloat(basePrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        learnMorePageId,
        images,
        metadata,
        variants,
        specifications,
      },
      session.user.id
    );

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
}
