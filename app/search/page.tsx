import type { Metadata } from "next";
import { SearchClient } from "@/components/commerce/search-client";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search TroyX iStore products by model, category, storage, color, and accessory type."
};

export default function SearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Smart Search"
        title="Search products, colors, storage, categories, and accessories."
        description="Find catalogue items quickly by model name, product family, storage size, color, or accessory type."
      />
      <Section>
        <SearchClient />
      </Section>
    </>
  );
}
