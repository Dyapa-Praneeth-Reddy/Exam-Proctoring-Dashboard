import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const ProfileModal = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    navigate(location.pathname);
  };

  const closeOverlay = (e) => {
    if (e.target.id === 'modal-overlay') {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setMessage('');
      await updateProfile(name, email, currentPassword, password);
      setMessage('Profile updated successfully!');
      setPassword(''); // Clear password field after update
      setConfirmPassword(''); // Clear confirm password
      setCurrentPassword(''); // Clear current password
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <div id="modal-overlay" onClick={closeOverlay} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10 bg-white shadow-sm border border-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 md:p-10 overflow-y-auto pt-12">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4 ring-4 ring-indigo-50">
              {getInitials(user.name)}
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Your Profile</h2>
            <p className="text-slate-500 text-sm mt-1">{user.role === 'teacher' ? 'Teacher Account' : 'Student Account'}</p>
          </div>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
        {message && <div className="bg-emerald-100 text-emerald-600 p-3 rounded mb-4">{message}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
              placeholder="Enter your email..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
              placeholder="Required only to change password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">New Password (optional)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
              placeholder="Leave blank to keep current"
            />
          </div>
          {password && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
                placeholder="Confirm your new password"
              />
            </div>
          )}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg mt-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ProfileModal;
