import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';

import TeacherDashboard from './pages/TeacherDashboard';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import ResultsAnalytics from './pages/ResultsAnalytics';
import StudentDashboard from './pages/StudentDashboard';
import ExamInterface from './pages/ExamInterface';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Exam Interface stands alone without layout wrapper */}
          <Route 
            path="/exam/:attemptId" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamInterface />
              </ProtectedRoute>
            } 
          />

          {/* Standalone Auth Pages Redirects */}
          <Route path="/login" element={<Navigate to="/?modal=login" replace />} />
          <Route path="/register" element={<Navigate to="/?modal=register" replace />} />

          {/* All other pages wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            
            <Route 
            path="/teacher-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-exam" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateExam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-exam/:id" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <EditExam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher-dashboard/analytics/:examId" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ResultsAnalytics />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
