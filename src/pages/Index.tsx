import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import FAQSection from "@/components/FAQSection";

const Index = () => (
  <Layout>
    <SEO
      title="Deliveries In Windhoek | Fast and Affordable | Parcel Fox"
      description="Need A Delivery In Windhoek? We offer parcel pickup and deliveries in Windhoek. Call Parcel Fox Windhoek 0816336344 to schedule your service."
      canonical="https://parcelfox.lovable.app/"
    />
    <HeroSection />
    <FAQSection />
  </Layout>
);

export default Index;
