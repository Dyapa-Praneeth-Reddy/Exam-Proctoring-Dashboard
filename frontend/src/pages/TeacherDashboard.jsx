import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, Users, Calendar, Activity, FileText } from 'lucide-react';

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get('/exams');
        setExams(data);
      } catch (error) {
        console.error('Failed to fetch exams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const totalQuestions = exams.reduce((acc, exam) => acc + exam.questions.length, 0);
  const recentExams = [...exams].reverse().slice(0, 3);

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Exams</h2>
            <p className="text-slate-500 mt-2 text-lg">Manage and monitor exams you've created.</p>
          </div>
          <Link
            to="/create-exam"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Create New Exam
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading dashboard...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 shadow-sm animate-slide-up">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No exams found</h3>
            <p className="text-slate-500 mb-6 text-lg">You haven't created any exams yet.</p>
            <Link
              to="/create-exam"
              className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <Plus className="h-5 w-5" /> Get started by creating one
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Exams Created</p>
                  <p className="text-2xl font-bold text-slate-900">{exams.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Questions Bank</p>
                  <p className="text-2xl font-bold text-slate-900">{totalQuestions}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                  <Activity className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Recent Activity</p>
                  <p className="text-2xl font-bold text-slate-900">{recentExams.length} Exams</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-6">All Exams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {exams.map((exam, index) => (
              <div 
                key={exam._id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                    <BookOpen className="h-6 w-6" />
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
                    <div className="flex items-center text-slate-600 text-sm font-medium">
                      <BookOpen className="h-4 w-4 mr-3 text-slate-400" />
                      {exam.questions.length} questions
                    </div>
                    {exam.scheduledDate && (
                      <div className="flex items-center text-indigo-700 font-semibold text-sm">
                        <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                        {new Date(exam.scheduledDate).toLocaleDateString()} ({exam.startTime} - {exam.endTime})
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/edit-exam/${exam._id}`} className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all text-center text-sm shadow-sm">
                      Edit Exam
                    </Link>
                    <Link to={`/teacher-dashboard/analytics/${exam._id}`} className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-100 transition-all text-center text-sm flex items-center justify-center gap-2">
                      <Users className="h-4 w-4" /> Analytics
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" /> Recent Activities
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {recentExams.map(exam => (
                  <div key={`recent-${exam._id}`} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Exam updated: {exam.title}</p>
                        <p className="text-xs text-slate-500">{exam.questions.length} questions • {exam.duration} mins</p>
                      </div>
                    </div>
                    <Link to={`/teacher-dashboard/analytics/${exam._id}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      View Analytics
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
