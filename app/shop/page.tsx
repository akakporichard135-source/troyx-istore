import type { Metadata } from "next";
import { ShopBrowser } from "@/components/product/shop-browser";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop genuine Apple devices and premium accessories from TroyX iStore."
};

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    filter?: string | string[];
    q?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category =
    typeof params?.category === "string" ? params.category : undefined;
  const filter = typeof params?.filter === "string" ? params.filter : undefined;
  const q = typeof params?.q === "string" ? params.q : undefined;
  const sort = typeof params?.sort === "string" ? params.sort : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Find the right device, accessory, and condition."
        description="Search, filter, sort, and compare a focused catalogue of Apple devices, gaming products, and accessories."
      />
      <Section>
        <ShopBrowser
          initialCategory={category}
          initialFilter={filter}
          initialQuery={q}
          initialSort={sort}
        />
      </Section>
    </>
  );
}
