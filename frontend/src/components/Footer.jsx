import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  if (location.pathname !== '/') return null;

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4 inline-flex">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ProctorSafe</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              A modern, robust, and reliable online exam proctoring dashboard.
              Ensuring academic integrity with advanced monitoring, tab-switch detection, 
              and automated anomaly reporting.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors bg-gray-800 p-2 rounded-full shadow-sm border border-gray-700">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full shadow-sm border border-gray-700">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors bg-gray-800 p-2 rounded-full shadow-sm border border-gray-700">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/?modal=login" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Teacher Login</Link></li>
              <li><Link to="/?modal=login" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Student Login</Link></li>
              <li><Link to="/?modal=register" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Create Account</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">System Requirements</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Legal & Privacy</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Academic Integrity Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">Support Center</a></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex justify-center items-center text-center">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} ProctorSafe Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
