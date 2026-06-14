import { Link } from 'react-router-dom';
import { Camera, Layers, ShieldAlert, BarChart3, ArrowRight, ShieldCheck, UserPlus, MonitorPlay, FileCheck2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col flex-1 relative">
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        {/* Decorative background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Modern Exam <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Proctoring</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
            A state-of-the-art platform ensuring fair assessments through advanced webcam monitoring, 
            intelligent tab-switch detection, and comprehensive analytics.
          </p>
          <div className="flex justify-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            {user ? (
              <Link 
                to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-10 py-4 rounded-xl hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-lg"
              >
                Go to Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link 
                to="/?modal=login"
                className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-10 py-4 rounded-xl hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-lg"
              >
                Login to Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Robust Security Features</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Everything you need to conduct exams with absolute confidence and fairness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 relative z-10">
                <Camera className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Webcam Monitoring</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Real-time facial detection ensures the correct student is present and monitoring for multiple faces or absence.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-amber-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 relative z-10">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Tab-Switch Detection</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Automatically detects and logs when a student leaves the exam tab or window, preventing unauthorized browsing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-rose-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 relative z-10">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Copy-Paste Prevention</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Disables clipboard access and right-click menus to prevent students from copying questions or pasting answers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 relative z-10">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Result Analytics</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Comprehensive dashboards for teachers to review scores, export PDF reports, and analyze violation logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">How It Works</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">A seamless experience for both educators and students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200"></div>

            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                <UserPlus className="h-10 w-10 text-indigo-600" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-slate-50">1</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Create an Account</h3>
              <p className="text-slate-600">Teachers create exams and share links. Students register and enroll in minutes.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                <MonitorPlay className="h-10 w-10 text-violet-600" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-slate-50">2</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Take the Exam</h3>
              <p className="text-slate-600">Students enter a secure environment where tabs, clipboard, and webcam are strictly monitored.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                <FileCheck2 className="h-10 w-10 text-emerald-600" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-slate-50">3</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Review Results</h3>
              <p className="text-slate-600">Teachers get instant access to scores and detailed incident reports for every student.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
