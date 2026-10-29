import { Hero } from "@/components/home/hero";
import {
  CategoriesSection,
  CollectionsSection,
  DesignTeaser,
  MarqueeBand,
  StoryBand,
  TrustBand,
  WorkshopSection,
} from "@/components/home/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeBand />
      <CollectionsSection />
      <DesignTeaser />
      <StoryBand />
      <CategoriesSection />
      <WorkshopSection />
      <TrustBand />
    </main>
  );
}
