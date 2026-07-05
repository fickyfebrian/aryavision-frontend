import { useNavigate } from "react-router-dom";
import {
  HeroSection,
  BenefitsSection,
  HowItWorksSection,
  ClusterOverviewSection,
  PopularProductsSection,
  CtaSection,
} from "../../../../components/sections";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <HeroSection onPrimaryClick={() => navigate("/catalog")} />
      <BenefitsSection />
      <HowItWorksSection />
      <ClusterOverviewSection />
      <PopularProductsSection />
      <CtaSection onCtaClick={() => navigate("/catalog")} />
    </main>
  );
};
