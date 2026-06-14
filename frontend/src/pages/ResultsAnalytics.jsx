import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Users, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ResultsAnalytics = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/analytics/results/${examId}`);
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [examId]);

  const exportPDF = () => {
    if (!data) return;
    
    const doc = new jsPDF();
    
    // Add document title and summary
    doc.setFontSize(18);
    doc.text(`${data.exam.title} - Results`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Total Attempts: ${data.totalAttempts} | Average Score: ${data.averageScore} | Total Violations: ${data.violations.length}`, 14, 30);

    const headers = [['Student Name', 'Email', 'Score', 'Status', 'Violations', 'Time Taken (mins)']];
    const rows = data.attempts.map(a => {
      const timeTaken = a.endTime ? ((new Date(a.endTime) - new Date(a.startTime)) / 60000).toFixed(1) : 'N/A';
      return [
        a.studentId?.name || 'Unknown',
        a.studentId?.email || 'Unknown',
        `${a.score} / ${data.exam.questions.length}`,
        a.status,
        a.violationCount,
        timeTaken
      ];
    });

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229] }, // match indigo-600 color
    });

    doc.save(`${data.exam.title.replace(/\s+/g, '_')}_results.pdf`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Failed to load analytics.</div>;
  }

  // Prepare chart data
  const scoreDistribution = {};
  data.attempts.forEach(a => {
    scoreDistribution[a.score] = (scoreDistribution[a.score] || 0) + 1;
  });
  const chartData = Object.keys(scoreDistribution).map(score => ({
    score: `Score: ${score}`,
    students: scoreDistribution[score]
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/teacher-dashboard')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{data.exam.title} - Results</h1>
              <p className="text-sm text-slate-500">Analytics and student performance</p>
            </div>
          </div>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Attempts</p>
              <p className="text-2xl font-bold text-slate-900">{data.totalAttempts}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Average Score</p>
              <p className="text-2xl font-bold text-slate-900">{data.averageScore} / {data.exam.questions.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Violations Logged</p>
              <p className="text-2xl font-bold text-slate-900">{data.violations.length}</p>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800">Student Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Violations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.attempts.map((attempt) => (
                      <tr key={attempt._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{attempt.studentId?.name || 'Unknown'}</div>
                          <div className="text-sm text-slate-500">{attempt.studentId?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-700">{attempt.score}</span>
                          <span className="text-slate-400 text-sm"> / {data.exam.questions.length}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attempt.status === 'auto-submitted' ? 'bg-red-100 text-red-800' :
                            attempt.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {attempt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {attempt.violationCount > 0 ? (
                            <span className="inline-flex items-center text-red-600 font-medium">
                              <AlertTriangle className="w-4 h-4 mr-1" /> {attempt.violationCount}
                            </span>
                          ) : (
                            <span className="text-slate-500">0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {data.attempts.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                          No attempts recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-500" /> Score Distribution
              </h2>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="score" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} allowDecimals={false} />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
                  Not enough data for chart
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ResultsAnalytics;
