import type { Metadata } from "next";
import { SearchClient } from "@/components/commerce/search-client";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Search", description: "Search products, categories, storage, colors, and accessories." };

export default function SearchPage() {
  return (
    <>
      <PageHeader eyebrow="Smart Search" title="Search products, colors, storage, categories, and accessories." description="Typing suggestions and recent-search storage are ready to expand with a search provider." />
      <Section><SearchClient /></Section>
    </>
  );
}
