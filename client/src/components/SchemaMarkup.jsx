import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ type = 'school', page }) => {
  const baseUrl = 'https://mountcarmelschool.edu.in';

  const schemas = {
    school: {
      '@context': 'https://schema.org',
      '@type': 'School',
      name: 'Mount Carmel School',
      description: 'A Christian missionary school committed to education, values, character, service, compassion, and excellence. Established in 2004, located at Seemanagar, 9th Mile, Krishnanagar.',
      url: baseUrl,
      logo: `${baseUrl}/images/branding/logo.webp`,
      image: `${baseUrl}/images/hero/banner.webp`,
      foundingDate: '2004',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Krishnanagar',
        addressRegion: 'West Bengal',
        streetAddress: 'Seemanagar, 9th Mile',
        addressCountry: 'IN'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'admissions',
        availableLanguage: ['English', 'Hindi']
      },
      sameAs: [],
      educationalLevel: 'Primary through Class X',
      schoolType: 'Christian Missionary School'
    },
    page: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page?.title || 'Mount Carmel School',
      description: page?.description || 'Mount Carmel School - A Christian missionary school committed to education, values, and excellence.',
      url: `${baseUrl}${page?.path || '/'}`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Mount Carmel School',
        url: baseUrl
      }
    }
  };

  const schema = schemas[type] || schemas.school;

  return (
    <Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Helmet>
  );
};

export default SchemaMarkup;
