import React from "react";
import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  path?: string;
}

const SITE_URL = "https://radlettfreemasons.org.uk";

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = `${SITE_URL}/og-preview.png`,
  canonical,
  path,
}) => {
  const url = canonical || (path ? `${SITE_URL}${path}` : SITE_URL);

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Radlett Freemasons Lodge No. 6652" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      <meta name="twitter:image" content={image} />

      {/* Mobile viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

export default SEOHead;
