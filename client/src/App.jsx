// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Register';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/Profile';
import AboutPage from './pages/AboutPage';
import CourseDetailsPage from './pages/CourseDetailsPage'; 
import TrainerDashboard from './pages/TrainerDashboard'; // <-- IMPORT NEW PAGE

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseDetailsPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="" element={<ProfilePage />} />
            </Route>
            
            {/* NEW: Trainer Dashboard */}
            <Route path="/trainer/dashboard" element={<PrivateRoute />}>
              <Route path="" element={<TrainerDashboard />} />
            </Route>
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;