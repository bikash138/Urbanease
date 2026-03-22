import { Suspense } from "react";
import HeroSection from "@/components/public/home/HeroSection";
import CategoriesSection, {
  CategoriesSectionHeader,
} from "@/components/public/home/CategoriesSection";
import ServicesSection, {
  ServicesSectionHeader,
} from "@/components/public/home/ServicesSection";
import { HomeSectionFallback } from "@/components/public/fallbacks";
import HowItWorksSection from "@/components/public/home/HowItWorksSection";
import CTABanner from "@/components/common/CTABanner";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <Suspense
        fallback={
          <HomeSectionFallback
            header={<CategoriesSectionHeader />}
            className="bg-zinc-50"
          />
        }
      >
        <CategoriesSection />
      </Suspense>
      <Suspense
        fallback={
          <HomeSectionFallback
            header={<ServicesSectionHeader />}
            className="bg-white"
          />
        }
      >
        <ServicesSection />
      </Suspense>
      <HowItWorksSection />
      <CTABanner />
    </div>
  );
}
