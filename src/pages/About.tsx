import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import AboutSection from "@/components/AboutSection";

const About = () => (
  <Layout>
    <SEO
      title="About Parcel Fox Windhoek | Local Courier Service"
      description="Parcel Fox Windhoek is a locally owned same-day courier serving every Windhoek neighbourhood. Learn who we are and why locals trust us."
      canonical="https://parcelfox.lovable.app/about"
    />
    <div className="pt-24">
      <AboutSection />
    </div>
  </Layout>
);

export default About;
