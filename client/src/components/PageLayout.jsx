import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import SchemaMarkup from './SchemaMarkup';

const PageLayout = ({ title, description, canonical, children, className = '', schema = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseUrl = 'https://mountcarmelschool.edu.in';
  const fullTitle = title ? `${title} | Mount Carmel School` : 'Mount Carmel School | Growing in Knowledge, Values and Compassion';
  const metaDescription = description || 'Mount Carmel School - A Christian missionary school committed to education, values, character, service, compassion, and excellence.';
  const canonicalUrl = canonical || `${baseUrl}${location.pathname}`;
  const ogImage = `${baseUrl}/images/hero/banner.webp`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const showBackButton = location.pathname !== '/';

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      {schema && <SchemaMarkup page={{ title, description: metaDescription, path: location.pathname }} />}
      <div className={className}>
        {children}
      </div>

      {showBackButton && (
        <button
          type="button"
          onClick={handleBack}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all duration-300 focus:outline-none group active:scale-95 border border-white/20"
          aria-label="Go to previous page"
          title="Go back to previous page"
        >
          <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold tracking-wider uppercase">Back</span>
        </button>
      )}
    </>
  );
};

export default PageLayout;
