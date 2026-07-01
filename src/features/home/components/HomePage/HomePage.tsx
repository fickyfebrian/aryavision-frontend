import {
  HeroSection,
  BenefitsSection,
  HowItWorksSection,
  ClusterOverviewSection,
  PopularProductsSection,
  CtaSection,
} from '../../../../components/sections';

export const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <ClusterOverviewSection />
      <PopularProductsSection />
      <CtaSection />
    </main>
  );
};
