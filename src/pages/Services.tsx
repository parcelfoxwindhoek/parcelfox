import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import ServicesSection from "@/components/ServicesSection";

const Services = () => (
  <Layout>
    <SEO
      title="Delivery Services in Windhoek | Parcel Fox"
      description="Same-day parcel, gift, flower, medicine, document and business courier delivery across Windhoek, Namibia. Fast, affordable and reliable."
      canonical="https://parcelfox.lovable.app/services"
    />
    <div className="pt-24">
      <ServicesSection />
    </div>
  </Layout>
);

export default Services;
