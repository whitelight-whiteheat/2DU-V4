import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

interface WebSiteData {
  name: string;
  url: string;
  description: string;
}

interface WebApplicationData {
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

interface BreadcrumbData {
  itemListElement: {
    position: number;
    name: string;
    item: string;
  }[];
}

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'WebApplication' | 'Breadcrumb';
  data: OrganizationData | WebSiteData | WebApplicationData | BreadcrumbData;
}

/**
 * StructuredData component for adding JSON-LD structured data to the application
 * This helps search engines better understand the content and context of the application
 * 
 * @param type - The type of structured data to add
 * @param data - The data to be added as structured data
 * @returns A Helmet component with the structured data
 */
const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: (data as OrganizationData).name,
          url: (data as OrganizationData).url,
          logo: (data as OrganizationData).logo,
          sameAs: (data as OrganizationData).sameAs,
        };
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: (data as WebSiteData).name,
          url: (data as WebSiteData).url,
          description: (data as WebSiteData).description,
        };
      case 'WebApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: (data as WebApplicationData).name,
          url: (data as WebApplicationData).url,
          description: (data as WebApplicationData).description,
          applicationCategory: (data as WebApplicationData).applicationCategory,
          operatingSystem: (data as WebApplicationData).operatingSystem,
          offers: (data as WebApplicationData).offers,
        };
      case 'Breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: (data as BreadcrumbData).itemListElement,
        };
      default:
        return {};
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default StructuredData; 