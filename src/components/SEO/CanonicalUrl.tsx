import React from 'react';
import { Helmet } from 'react-helmet-async';

interface CanonicalUrlProps {
  url: string;
}

/**
 * CanonicalUrl component for adding canonical URL tags to the application
 * This helps search engines understand the preferred version of a page
 * and prevents duplicate content issues
 * 
 * @param url - The canonical URL for the current page
 * @returns A Helmet component with the canonical URL tag
 */
const CanonicalUrl: React.FC<CanonicalUrlProps> = ({ url }) => {
  return (
    <Helmet>
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default CanonicalUrl; 