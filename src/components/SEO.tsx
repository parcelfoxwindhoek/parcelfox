import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
}

const DEFAULT_TITLE =
  "Deliveries In Windhoek | Fast and Affordable | Parcel Fox";
const DEFAULT_DESCRIPTION =
  "Need A Delivery In Windhoek? We offer parcel pickup and deliveries in Windhoek. Call Parcel Fox Windhoek 0816336344 to schedule your service.";
const SITE_URL = "https://parcelfoxwindhoek.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = SITE_URL,
  image = DEFAULT_IMAGE,
}: SEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Parcel Fox Windhoek" />
    <meta property="og:locale" content="en_NA" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Helmet>
);

export default SEO;
