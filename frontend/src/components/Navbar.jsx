import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LayoutDashboard, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'teacher') return '/teacher-dashboard';
    if (user?.role === 'student') return '/student-dashboard';
    return '/';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-[0_4px_30px_rgb(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition-colors shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">ProctorSafe</span>
        </Link>
        
        <div className="flex items-center gap-8">
          {location.pathname === '/' && (
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</a>
              <a href="#about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About</a>
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 md:gap-4">
                {location.pathname !== getDashboardLink() && (
                  <Link 
                    to={getDashboardLink()}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}

                <Link 
                  to={`${location.pathname}?modal=profile`}
                  className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {getInitials(user.name)}
                  </div>
                  <span className="font-bold hidden sm:inline">{user.name}</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/?modal=login"
                className="text-slate-600 hover:text-indigo-600 font-semibold px-4 py-2 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/?modal=register"
                className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
