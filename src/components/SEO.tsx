import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: any;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Premium Grader & Parts Marketplace - Türkiye'nin En Büyük Motor Greyder Pazarı",
  description = "Türkiye'nin en kapsamlı motor greyder ve yedek parça pazarı. Premium kalitede grader araçları, yedek parçalar ve profesyonel hizmetler. Hızlı teslimat, güvenli ödeme, uzman desteği.",
  keywords = "motor greyder, grader, yedek parça, inşaat makinesi, CAT grader, Caterpillar, yedek parça satışı, grader kiralama, inşaat ekipmanları",
  image = "https://grader-marketplace.com/og-image.jpg",
  url = "https://grader-marketplace.com",
  type = "website",
  structuredData
}) => {
  const fullTitle = title.includes('Grader Marketplace') ? title : `${title} | Grader Marketplace`;
  const fullUrl = url.startsWith('http') ? url : `https://grader-marketplace.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://grader-marketplace.com${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Grader Marketplace" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for different page types
export const SEOConfigs = {
  home: {
    title: "Premium Grader & Parts Marketplace - Türkiye'nin En Büyük Motor Greyder Pazarı",
    description: "Türkiye'nin en kapsamlı motor greyder ve yedek parça pazarı. Premium kalitede grader araçları, yedek parçalar ve profesyonel hizmetler.",
    keywords: "motor greyder, grader, yedek parça, inşaat makinesi, CAT grader, Caterpillar",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Grader Marketplace",
      "url": "https://grader-marketplace.com",
      "description": "Türkiye'nin en kapsamlı motor greyder ve yedek parça pazarı",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://grader-marketplace.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  graderDetails: (grader: any) => ({
    title: `${grader.brand} ${grader.model} ${grader.year} - Motor Greyder`,
    description: `${grader.brand} ${grader.model} ${grader.year} model motor greyder. ${grader.description?.substring(0, 150)}...`,
    keywords: `${grader.brand}, ${grader.model}, motor greyder, grader, ${grader.year}`,
    type: "product" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${grader.brand} ${grader.model} ${grader.year}`,
      "description": grader.description,
      "brand": {
        "@type": "Brand",
        "name": grader.brand
      },
      "model": grader.model,
      "category": "Motor Greyder",
      "offers": {
        "@type": "Offer",
        "price": grader.price,
        "priceCurrency": "TRY",
        "availability": grader.is_sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
      },
      "image": grader.images?.[0],
      "condition": "https://schema.org/UsedCondition"
    }
  }),
  
  partDetails: (part: any) => ({
    title: `${part.name} - ${part.brand} Yedek Parça`,
    description: `${part.brand} marka ${part.name} yedek parçası. ${part.description?.substring(0, 150)}...`,
    keywords: `${part.brand}, ${part.name}, yedek parça, grader parçası`,
    type: "product" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": part.name,
      "description": part.description,
      "brand": {
        "@type": "Brand",
        "name": part.brand
      },
      "category": "Yedek Parça",
      "offers": {
        "@type": "Offer",
        "price": part.price,
        "priceCurrency": "TRY",
        "availability": part.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      "image": part.image
    }
  }),
  
  gallery: {
    title: "Motor Greyder Galerisi - Premium Grader Araçları",
    description: "En kaliteli motor greyder araçlarını keşfedin. CAT, Caterpillar ve diğer markaların premium grader modelleri.",
    keywords: "grader galerisi, motor greyder modelleri, CAT grader, Caterpillar grader",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Motor Greyder Galerisi",
      "description": "En kaliteli motor greyder araçlarını keşfedin",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Motor Greyder Araçları"
      }
    }
  },
  
  parts: {
    title: "Yedek Parça Kataloğu - Grader Parçaları",
    description: "Motor greyder yedek parçaları kataloğu. Orijinal ve kaliteli yedek parçalar, hızlı teslimat.",
    keywords: "yedek parça, grader parçası, CAT yedek parça, Caterpillar parça",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Yedek Parça Kataloğu",
      "description": "Motor greyder yedek parçaları kataloğu",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Yedek Parçalar"
      }
    }
  },
  
  about: {
    title: "Hakkımızda - Grader Marketplace",
    description: "Grader Marketplace hakkında bilgi edinin. Türkiye'nin en güvenilir motor greyder ve yedek parça platformu.",
    keywords: "hakkımızda, grader marketplace, şirket bilgisi, misyon, vizyon",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Hakkımızda",
      "description": "Grader Marketplace hakkında bilgi edinin"
    }
  },
  
  contact: {
    title: "İletişim - Grader Marketplace",
    description: "Grader Marketplace ile iletişime geçin. Sorularınız için bizimle iletişime geçin.",
    keywords: "iletişim, grader marketplace, müşteri hizmetleri, destek",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "İletişim",
      "description": "Grader Marketplace ile iletişime geçin"
    }
  }
};
