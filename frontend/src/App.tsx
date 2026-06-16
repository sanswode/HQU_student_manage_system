import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useThemeStore, useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './components/Layout';
import StudentDashboard from './pages/Student/Dashboard';
import StudentCourses from './pages/Student/Courses';
import StudentStatistics from './pages/Student/Statistics';
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherCourses from './pages/Teacher/Courses';
import TeacherStudents from './pages/Teacher/Students';

// 受保护路由组件
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode; 
  allowedRole: 'student' | 'teacher';
}) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'student' ? '/student' : '/teacher'} replace />;
  }

  return <>{children}</>;
};

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 学生路由 */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <AppLayout userType="student" />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="statistics" element={<StudentStatistics />} />
          </Route>

          {/* 教师路由 */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole="teacher">
                <AppLayout userType="teacher" />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="students" element={<TeacherStudents />} />
          </Route>

          {/* 默认路由 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;