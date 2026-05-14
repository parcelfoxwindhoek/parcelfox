import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import ContactSection from "@/components/ContactSection";

const Contact = () => (
  <Layout>
    <SEO
      title="Contact Parcel Fox Windhoek | Request a Pickup"
      description="Request a parcel pickup or get a delivery quote from Parcel Fox Windhoek. Call +264 81 633 6344 or send us a message."
      canonical="https://parcelfox.lovable.app/contact"
    />
    <div className="pt-24">
      <ContactSection />
    </div>
  </Layout>
);

export default Contact;
