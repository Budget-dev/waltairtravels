import React, { useEffect } from 'react';

export interface BreadcrumbEntry {
  name: string;
  item: string;
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  breadcrumbs?: BreadcrumbEntry[];
  faqs?: FAQEntry[];
  structuredData?: object | object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [
    'Visakhapatnam taxi',
    'Vizag cabs',
    'Waltair Cabs',
    'Bhogapuram airport taxi',
    'Airport taxi Vizag',
    'Vizag to Araku cab',
    'Outstation cabs Vizag',
    'Local cabs Vizag',
    'Andhra Pradesh taxi service',
  ],
  canonicalPath,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://waltairtravelsandcabs.sirv.com/Glossy%20WT%20Road%20Trip%20App%20Icon.png',
  breadcrumbs,
  faqs,
  structuredData,
}) => {
  useEffect(() => {
    const CANONICAL_BASE = 'https://waltaircabs.in';
    const effectivePath = canonicalPath || canonicalUrl;
    const formattedCanonical = effectivePath
      ? `${CANONICAL_BASE}${effectivePath.startsWith('/') ? '' : '/'}${effectivePath}`
      : `${CANONICAL_BASE}${window.location.pathname.length > 1 ? window.location.pathname : '/'}`;

    // 1. Update Title (Human-first, localized)
    const fullTitle = title.includes('Waltair Cabs')
      ? title
      : `${title} | Waltair Cabs Visakhapatnam`;
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

    // 4. Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', formattedCanonical);

    // 5. OpenGraph Tags
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:type': ogType,
      'og:image': ogImage,
      'og:url': formattedCanonical,
      'og:site_name': 'Waltair Cabs',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 6. Twitter / X Cards
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 7. Structured Data Graph Generation (JSON-LD)
    const scriptId = 'waltair-page-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const graphEntities: object[] = [];

    // Core TaxiService Entity
    graphEntities.push({
      '@type': 'TaxiService',
      '@id': 'https://waltaircabs.in/#service',
      'name': 'Waltair Cabs Visakhapatnam',
      'url': formattedCanonical,
      'provider': {
        '@id': 'https://waltaircabs.in/#organization',
      },
      'serviceType': 'Cab and Taxi Service',
      'telephone': '+91-9110510236',
      'priceRange': '₹₹',
      'areaServed': [
        { '@type': 'City', 'name': 'Visakhapatnam' },
        { '@type': 'AdministrativeArea', 'name': 'Bhogapuram' },
        { '@type': 'City', 'name': 'Araku Valley' },
        { '@type': 'City', 'name': 'Vizianagaram' },
        { '@type': 'City', 'name': 'Srikakulam' },
        { '@type': 'City', 'name': 'Anakapalle' },
      ],
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock',
        'priceValidUntil': '2027-12-31',
      },
    });

    // Core LocalBusiness Entity
    graphEntities.push({
      '@type': 'LocalBusiness',
      '@id': 'https://waltaircabs.in/#organization',
      'name': 'Waltair Cabs',
      'url': 'https://waltaircabs.in',
      'logo': 'https://waltaircabs.in/logo.png',
      'image': ogImage,
      'telephone': '+91-9110510236',
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
    });

    // Breadcrumbs Schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      graphEntities.push({
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': crumb.name,
          'item': crumb.item.startsWith('http')
            ? crumb.item
            : `${CANONICAL_BASE}${crumb.item.startsWith('/') ? '' : '/'}${crumb.item}`,
        })),
      });
    }

    // FAQPage Schema if provided
    if (faqs && faqs.length > 0) {
      graphEntities.push({
        '@type': 'FAQPage',
        'mainEntity': faqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      });
    }

    // Additional custom structured data if passed
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        graphEntities.push(...structuredData);
      } else {
        graphEntities.push(structuredData);
      }
    }

    scriptTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graphEntities,
    });

    // Smooth scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [title, description, keywords, canonicalPath, ogType, ogImage, breadcrumbs, faqs, structuredData]);

  return null;
};
