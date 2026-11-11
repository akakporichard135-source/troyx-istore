import React from "react";
import { getPublishedSections } from "@/lib/storage/db";
import SectionRenderer from "@/components/public/SectionRenderer";
import EmptyState from "@/components/public/EmptyState";

export const revalidate = 0; // Fresh CMS content delivery

export default async function HomePage() {
  // Fetch only published sections for homepage
  const sections = await getPublishedSections("page-home");

  // Initial State: All 6 drafts are unpublished
  // Header and Footer are displayed, with a clean, intentionally empty main content area
  if (!sections || sections.length === 0) {
    return <EmptyState minimal={true} />;
  }

  return (
    <div className="w-full flex flex-col space-y-3 pb-12 bg-black">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
