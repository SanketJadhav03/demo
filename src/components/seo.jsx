import AuthUser from "@/auth/authuser";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SEO = ({
  pageTitle = "Sai Suppliers, Phaltan",
  fallbackDescription = "Buy top-quality products, hardware, and materials from Sai Suppliers, Phaltan.",
  productName = "",
  fallbackImage = "/default-image.png",
}) => {
  const canonicalUrl = `https://www.saisuppliers.com`;
  const { http } = AuthUser();

  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await http.get("/seo");
        const active = res.data.find((s) => s.is_active === 1);
        setSeoData(active || null);
      } catch (err) {
        console.error("Failed to fetch SEO:", err);
      }
    };

    fetchSeo();
  }, []);

  // Generate keyword phrases from productName
  const generateKeywords = (name) => {
    if (!name) return [];
    return [
      `${name} price`,
      `Buy ${name} online`,
      `${name} in Phaltan`,
      `Cheap ${name}`,
      `${name} suppliers`,
    ];
  };

  // Combine dynamic and stored keywords
  const generated = generateKeywords(productName);
  const fromApi = seoData?.keywords
    ? seoData.keywords.split(",").map((k) => k.trim())
    : [];

  // Deduplicate and trim to 10 keywords
  const allKeywords = [...new Set([ ...generated,...fromApi])].slice(0, 10);
  const keywords = allKeywords.join(", ");

  const metaTitle = seoData?.meta_description || pageTitle;
  const metaDescription = seoData?.meta_description || fallbackDescription;
  const ogImage = fallbackImage;

  return (
    <Head>
      <title>{`${metaTitle} - Sai Suppliers, Phaltan`}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default SEO;
