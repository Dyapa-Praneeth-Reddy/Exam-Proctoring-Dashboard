import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ChevronRight, ChevronLeft, Maximize } from 'lucide-react';
import WebcamProctor from '../components/WebcamProctor';

const VIOLATION_LIMIT = 5;

const ExamInterface = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const examContainerRef = useRef(null);

  // Fetch attempt and exam details
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const { data: attemptData } = await axios.get('/attempts/my-attempts');
        const currentAttempt = attemptData.find(a => a._id === attemptId);
        
        if (!currentAttempt || currentAttempt.status !== 'in-progress') {
          navigate('/student-dashboard');
          return;
        }
        
        setAttempt(currentAttempt);
        setViolations(currentAttempt.violationCount || 0);
        
        const { data: examData } = await axios.get(`/exams/${currentAttempt.examId._id || currentAttempt.examId}`);
        setExam(examData);

        if (examData.scheduledDate && examData.startTime && examData.endTime) {
          const nowCheck = new Date();
          const [startHour, startMin] = examData.startTime.split(':');
          const [endHour, endMin] = examData.endTime.split(':');
          
          const dateStr = examData.scheduledDate.split('T')[0];
          const [year, month, day] = dateStr.split('-');
          
          const startDate = new Date(year, month - 1, day, startHour, startMin, 0);
          const endDate = new Date(year, month - 1, day, endHour, endMin, 0);
          
          if (nowCheck < startDate || nowCheck > endDate) {
            alert('This exam is not currently active and cannot be taken.');
            navigate('/student-dashboard');
            return;
          }
        }

        const startTime = new Date(currentAttempt.startTime).getTime();
        const durationMs = examData.duration * 60 * 1000;
        const endTime = startTime + durationMs;
        const now = new Date().getTime();
        
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);

        if (currentAttempt.answers && currentAttempt.answers.length > 0) {
          const ansMap = {};
          currentAttempt.answers.forEach(a => {
            ansMap[a.questionId] = a.selectedOption;
          });
          setAnswers(ansMap);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam', error);
        navigate('/student-dashboard');
      }
    };
    fetchExamDetails();
  }, [attemptId, navigate]);

  const handleSubmit = useCallback(async (isAutoSubmit = false, reason = 'Time is up') => {
    try {
      const formattedAnswers = Object.keys(answers).map(qId => ({
        questionId: qId,
        selectedOption: answers[qId]
      }));

      await axios.put(`/attempts/${attemptId}/submit`, {
        answers: formattedAnswers,
        isAutoSubmit
      });

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      
      alert(isAutoSubmit ? `Exam auto-submitted. Reason: ${reason}` : 'Exam submitted successfully.');
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Submit failed', error);
      alert('Failed to submit exam');
    }
  }, [answers, attemptId, navigate]);

  const logViolation = useCallback(async (type) => {
    try {
      const { data } = await axios.post('/violations/log', {
        attemptId,
        type
      });
      setViolations(data.currentViolationCount);
      
      if (data.currentViolationCount >= VIOLATION_LIMIT) {
        handleSubmit(true, `Exceeded violation limit (${VIOLATION_LIMIT}). Last violation: ${type}`);
      }
      // Removed window.alert() because it steals focus and exits fullscreen automatically,
      // creating an infinite loop of violations.
    } catch (error) {
      console.error('Failed to log violation', error);
    }
  }, [attemptId, handleSubmit]);

  // Proctoring Effects
  useEffect(() => {
    if (loading || !isFullscreen) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('tab-switch');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        logViolation('fullscreen-exit');
      }
    };

    const blockDefault = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', blockDefault);
    document.addEventListener('copy', blockDefault);
    document.addEventListener('paste', blockDefault);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', blockDefault);
      document.removeEventListener('copy', blockDefault);
      document.removeEventListener('paste', blockDefault);
    };
  }, [loading, isFullscreen, logViolation]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || !isFullscreen) return; // Only count down if fullscreen (started)
    
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isFullscreen, handleSubmit]);

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen().then(() => {
      setIsFullscreen(true);
    }).catch(err => {
      alert('Error attempting to enable fullscreen mode: ' + err.message);
    });
  };

  const handleOptionSelect = (qId, oIndex) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: oIndex
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !exam) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading exam...</div>;
  }

  if (!isFullscreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Proctored Exam</h2>
          <p className="text-slate-600 mb-6 text-sm">
            This exam is strictly monitored. Do not switch tabs, exit full screen, or attempt to copy-paste. 
            Any violation will be logged. Reaching {VIOLATION_LIMIT} violations will auto-submit your exam.
          </p>
          <button 
            onClick={requestFullscreen}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Maximize className="h-5 w-5" /> Enter Full Screen to Begin
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div ref={examContainerRef} className="min-h-screen bg-slate-50 flex flex-col overflow-y-auto">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{exam.title}</h1>
          <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Violations:</span>
            <span className={`font-bold px-2 py-1 rounded ${violations >= VIOLATION_LIMIT - 1 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              {violations} / {VIOLATION_LIMIT}
            </span>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to submit the exam?')) {
                handleSubmit(false);
              }
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Submit Exam
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex gap-8">
        
        <div className="flex-1 max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
            <h2 className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
              <span className="text-indigo-600 font-bold mr-2">{currentQuestionIndex + 1}.</span>
              {currentQuestion.questionText}
            </h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((opt, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[currentQuestion._id] === idx 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    checked={answers[currentQuestion._id] === idx}
                    onChange={() => handleOptionSelect(currentQuestion._id, idx)}
                    className="mt-1 w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="ml-3 text-slate-700 text-lg">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <ChevronLeft className="h-5 w-5" /> Previous
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === exam.questions.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === exam.questions.length - 1 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              Next <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="w-64 shrink-0 flex flex-col gap-6">
          <WebcamProctor onViolation={logViolation} />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-28">
            <h3 className="font-bold text-slate-800 mb-4">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {exam.questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                    currentQuestionIndex === idx 
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 shadow-sm' 
                      : answers[q._id] !== undefined
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ExamInterface;
