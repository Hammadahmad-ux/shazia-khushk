import { HomeCategoryGrid } from "@/components/home/home-category-grid";
import { HomeEditorialSections } from "@/components/home/home-editorial-sections";
import { HomeHero } from "@/components/home/home-hero";
import { HomeNewsletter } from "@/components/home/home-newsletter";
import { HomeStories } from "@/components/home/home-stories";
import { HomeProductGrid } from "@/components/home/home-product-grid";

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeHero />
      <HomeProductGrid />
      <HomeCategoryGrid />
      <HomeStories />
      <HomeEditorialSections />
      <HomeNewsletter />
    </div>
  );
}
