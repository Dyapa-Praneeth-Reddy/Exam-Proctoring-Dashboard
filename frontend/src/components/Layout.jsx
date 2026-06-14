import { Outlet, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProfileModal from './ProfileModal';

const Layout = () => {
  const [searchParams] = useSearchParams();
  const modal = searchParams.get('modal');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 relative">
      {modal === 'login' && <Login />}
      {modal === 'register' && <Register />}
      {modal === 'profile' && <ProfileModal />}

      <Navbar />
      
      {/* 
        flex-1 ensures this container grows to fill the space 
        between the navbar and footer. 
      */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
