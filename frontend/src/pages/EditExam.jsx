import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Clock, AlignLeft } from 'lucide-react';

const EditExam = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [examPassword, setExamPassword] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await axios.get(`/exams/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setDuration(data.duration);
        setExamPassword(data.examPassword || '');
        if (data.scheduledDate) {
          setScheduledDate(new Date(data.scheduledDate).toISOString().split('T')[0]);
        }
        setStartTime(data.startTime || '');
        setEndTime(data.endTime || '');
        setQuestions(data.questions);
      } catch (error) {
        console.error('Failed to load exam', error);
        alert('Failed to load exam data.');
        navigate('/teacher-dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id, navigate]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctOption: 0 }
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSaveExam = async () => {
    if (!title || !duration || duration <= 0 || questions.length === 0) {
      alert('Title, valid duration, and at least one question are required.');
      return;
    }
    if (startTime && endTime && startTime >= endTime) {
      alert('End time must be after start time.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || q.options.some(opt => !opt)) {
        alert(`Question ${i + 1} is incomplete.`);
        return;
      }
    }

    try {
      await axios.put(`/exams/${id}`, {
        title,
        description,
        duration,
        examPassword,
        scheduledDate,
        startTime,
        endTime,
        questions
      });
      navigate('/teacher-dashboard');
    } catch (error) {
      console.error('Failed to update exam', error);
      alert('Failed to update exam.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/teacher-dashboard')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Edit Exam</h1>
          </div>
          <button 
            onClick={handleSaveExam}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Save className="h-5 w-5" /> Save Changes
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Exam Details Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlignLeft className="h-5 w-5 text-indigo-500" /> Exam Configuration
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exam Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="e.g., Midterm Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors h-24 resize-none"
                placeholder="Brief description or instructions for the exam..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (Minutes)</label>
              <div className="relative w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exam Password (Optional)</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                placeholder="e.g., PHYSICS2024"
                value={examPassword}
                onChange={(e) => setExamPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Date (If required)</label>
              <input 
                type="date" 
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time (If required)</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time (If required)</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Questions ({questions.length})</h2>
          <button 
            onClick={addQuestion}
            className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Question"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 pr-12">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Question {qIndex + 1}
                </label>
                <input 
                  type="text" 
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter the question text..."
                />
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-indigo-100">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name={`correct-${qIndex}`} 
                      checked={q.correctOption === oIndex}
                      onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                      title="Mark as correct answer"
                    />
                    <input 
                      type="text" 
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${q.correctOption === oIndex ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300'}`}
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 mb-4">No questions added yet.</p>
              <button 
                onClick={addQuestion}
                className="flex items-center gap-2 mx-auto text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add First Question
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditExam;
