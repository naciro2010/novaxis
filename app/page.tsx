import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FusionSection from '@/components/FusionSection';
import VisionSection from '@/components/VisionSection';
import SolutionsSection from '@/components/SolutionsSection';
import PartnersSection from '@/components/PartnersSection';
import SecuritySection from '@/components/SecuritySection';
import ComparisonSection from '@/components/ComparisonSection';
import TeamSection from '@/components/TeamSection';
import StatsSection from '@/components/StatsSection';
import TrustSection from '@/components/TrustSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <main className="relative z-10 overflow-x-clip">
      <Navbar />
      <Hero />
      <FusionSection />
      <VisionSection />
      <SolutionsSection />
      <PartnersSection />
      <SecuritySection />
      <ComparisonSection />
      <TeamSection />
      <StatsSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}
