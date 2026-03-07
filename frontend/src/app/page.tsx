"use client";

import PublicNavbar from "@/components/public/PublicNavbar";
import HeroSection from "@/components/public/home/HeroSection";
import CategoriesSection from "@/components/public/home/CategoriesSection";
import ServicesSection from "@/components/public/home/ServicesSection";
import HowItWorksSection from "@/components/public/home/HowItWorksSection";
import CTABanner from "@/components/common/CTABanner";
import Footer from "@/components/common/Footer";
import { usePublicCategories, usePublicServices } from "@/hooks/public/usePublic";

export default function LandingPage() {
  const { data: categories, isLoading: isLoadingCategories } = usePublicCategories();
  const { data: services, isLoading: isLoadingServices } = usePublicServices();

  const displayCategories = categories?.slice(0, 8) ?? [];
  const displayServices = services?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <HeroSection
        isLoadingCategories={isLoadingCategories}
        displayCategories={displayCategories}
      />
      <CategoriesSection
        isLoadingCategories={isLoadingCategories}
        displayCategories={displayCategories}
        totalCategories={categories?.length}
      />
      <ServicesSection
        isLoadingServices={isLoadingServices}
        displayServices={displayServices}
      />
      <HowItWorksSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
