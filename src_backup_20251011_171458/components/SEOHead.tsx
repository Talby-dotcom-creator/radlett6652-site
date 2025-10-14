import React from "react";
import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = "https://radlettlodge.co.uk/og-preview.jpg",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:url" content="https://radlettlodge.co.uk" />

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
