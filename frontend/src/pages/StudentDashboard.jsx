import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen, CheckCircle, Calendar, Lock, Target, TrendingUp, AlertCircle, X } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamForPassword, setSelectedExamForPassword] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, attemptsRes] = await Promise.all([
          axios.get('/exams'),
          axios.get('/attempts/my-attempts')
        ]);
        setExams(examsRes.data);
        setAttempts(attemptsRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedAttempts = attempts.filter(a => a.status === 'submitted' || a.status === 'auto-submitted');
  const avgScore = completedAttempts.length > 0 
    ? (completedAttempts.reduce((acc, a) => acc + a.score, 0) / completedAttempts.length).toFixed(1) 
    : 0;

  const getExamStatus = (exam) => {
    if (!exam.scheduledDate) return 'Active';
    const now = new Date();
    const examDate = new Date(exam.scheduledDate);
    if (examDate.toDateString() === now.toDateString()) {
      return 'Active';
    }
    return examDate > now ? 'Upcoming' : 'Ended';
  };

  const getAttemptStatus = (examId) => {
    return attempts.find(a => (a.examId?._id || a.examId) === examId);
  };

  const initiateExam = (exam) => {
    if (exam.hasPassword) {
      setSelectedExamForPassword(exam);
      setPasswordInput('');
      setPasswordError('');
    } else {
      handleStartExam(exam._id);
    }
  };

  const handleStartExam = async (examId, password = null) => {
    try {
      setPasswordError('');
      const payload = { examId };
      if (password) payload.password = password;
      const res = await axios.post('/attempts/start', payload);
      navigate(`/exam/${res.data._id}`);
    } catch (error) {
      console.error('Failed to start exam', error);
      if (password) {
        setPasswordError(error.response?.data?.message || 'Failed to start exam');
      } else {
        alert(error.response?.data?.message || 'Failed to start exam');
      }
    }
  };

  const activeExams = exams.filter(e => getExamStatus(e) === 'Active' && !completedAttempts.find(a => (a.examId?._id || a.examId) === e._id));
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Dashboard</h2>
          <p className="text-slate-500 mt-2 text-lg">Track your performance and take your upcoming exams.</p>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 shadow-sm animate-slide-up">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No exams available</h3>
            <p className="text-slate-500 text-lg">There are no exams assigned to you at the moment.</p>
          </div>
        ) : (
          <>
            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Exams Completed</p>
                  <p className="text-2xl font-bold text-slate-900">{completedAttempts.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Average Score</p>
                  <p className="text-2xl font-bold text-slate-900">{avgScore}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Actions</p>
                  <p className="text-2xl font-bold text-slate-900">{activeExams.length}</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-6">Your Exams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {exams.map((exam, index) => {
              const attempt = getAttemptStatus(exam._id);
              const examStatus = getExamStatus(exam);
              
              return (
                <div 
                  key={exam._id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      {examStatus === 'Upcoming' && <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Upcoming</span>}
                      {examStatus === 'Active' && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active</span>}
                      {examStatus === 'Ended' && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Ended</span>}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{exam.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
                      {exam.description || 'No description provided.'}
                    </p>
                    
                    <div className="space-y-3 mb-8 bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                      <div className="flex items-center text-slate-600 text-sm font-medium">
                        <Clock className="h-4 w-4 mr-3 text-slate-400" />
                        {exam.duration} minutes
                      </div>
                      {exam.scheduledDate && (
                        <div className="flex items-center text-indigo-700 font-semibold text-sm">
                          <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                          {new Date(exam.scheduledDate).toLocaleDateString()} ({exam.startTime} - {exam.endTime})
                        </div>
                      )}
                    </div>

                    {attempt ? (
                      attempt.status === 'in-progress' ? (
                        <button 
                          onClick={() => initiateExam(exam)}
                          disabled={examStatus !== 'Active'}
                          className={`w-full text-white px-4 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 ${examStatus === 'Active' ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg' : 'bg-slate-300 cursor-not-allowed'}`}
                        >
                          {examStatus === 'Active' ? (exam.hasPassword ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5" />) : <Lock className="h-5 w-5" />}
                          Resume Exam
                        </button>
                      ) : (
                        <div className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold text-center flex justify-center items-center gap-2 shadow-sm">
                          <CheckCircle className="h-5 w-5 text-emerald-500" /> Completed (Score: {attempt.score})
                        </div>
                      )
                    ) : (
                      <button 
                        onClick={() => initiateExam(exam)}
                        disabled={examStatus !== 'Active'}
                        className={`w-full text-white px-4 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 ${examStatus === 'Active' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed'}`}
                      >
                        {examStatus === 'Active' ? (exam.hasPassword ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5" />) : <Lock className="h-5 w-5" />}
                        Start Exam
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}
      </main>

      {/* Password Modal */}
      {selectedExamForPassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white p-8 md:p-10 rounded-3xl w-full max-w-md relative shadow-2xl animate-slide-up">
            <button 
              onClick={() => setSelectedExamForPassword(null)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4 ring-4 ring-amber-50">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 text-center">Exam Password Required</h2>
              <p className="text-slate-500 text-sm mt-2 text-center line-clamp-1">{selectedExamForPassword.title}</p>
            </div>
            
            {passwordError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); handleStartExam(selectedExamForPassword._id, passwordInput); }} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 text-center tracking-widest font-mono text-lg"
                  placeholder="Enter Password"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg mt-2">
                Access Exam
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
