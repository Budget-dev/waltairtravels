import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  structuredData?: object | object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [
    'Visakhapatnam taxi',
    'Vizag cabs',
    'Bhogapuram airport taxi',
    'Waltair Travels',
    'Outstation cabs Vizag',
    'Araku tour package cab',
    'Andhra Pradesh taxi service',
  ],
  canonicalPath,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
  structuredData,
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | Waltair Travels Visakhapatnam`;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // 4. OpenGraph Tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:type': ogType,
      'og:image': ogImage,
      'og:site_name': 'Waltair Travels',
    };

    if (canonicalPath) {
      const canonicalUrl = `${window.location.origin}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;
      ogTags['og:url'] = canonicalUrl;

      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonicalUrl);
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 5. JSON-LD Structured Data Schema for Google Search Engine Bot / Crawlers
    const scriptId = 'waltair-page-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultOrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'TaxiService',
      'name': 'Waltair Travels Visakhapatnam',
      'image': ogImage,
      '@id': 'https://waltairtravels.com',
      'url': 'https://waltairtravels.com',
      'telephone': '+91-9123456789',
      'priceRange': '₹₹',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Waltair Uplands, Siripuram',
        'addressLocality': 'Visakhapatnam',
        'addressRegion': 'Andhra Pradesh',
        'postalCode': '530003',
        'addressCountry': 'IN',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 17.7208,
        'longitude': 83.3184,
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        'opens': '00:00',
        'closes': '23:59',
      },
      'areaServed': [
        'Visakhapatnam',
        'Bhogapuram',
        'Vizianagaram',
        'Srikakulam',
        'Anakapalle',
        'Araku Valley',
        'Rajahmundry',
        'Vijayawada',
        'Hyderabad',
      ],
    };

    const finalSchema = structuredData
      ? Array.isArray(structuredData)
        ? [defaultOrganizationSchema, ...structuredData]
        : [defaultOrganizationSchema, structuredData]
      : defaultOrganizationSchema;

    scriptTag.textContent = JSON.stringify(finalSchema);

    // Scroll to top upon page navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [title, description, keywords, canonicalPath, ogType, ogImage, structuredData]);

  return null;
};
