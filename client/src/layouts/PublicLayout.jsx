import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ivory overflow-x-hidden w-full relative">
      <Header />
      <div className="flex-1 overflow-x-hidden w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
