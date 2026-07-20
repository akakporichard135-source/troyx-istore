import type { Metadata } from "next";
import { ShopBrowser } from "@/components/product/shop-browser";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop genuine Apple devices and premium accessories from TroyX iStore."
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Find the right device, accessory, and condition."
        description="Use advanced search, filters, sorting, grid or list views, recommendations, and recently viewed support powered by the local catalog."
      />
      <Section>
        <ShopBrowser />
      </Section>
    </>
  );
}
