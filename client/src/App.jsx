// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// FIX: Corrected all import paths to match your file names
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Register';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/Profile';
import AboutPage from './pages/AboutPage'; // This one was already correct

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
            
            {/* Protected Routes */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="" element={<ProfilePage />} />
            </Route>
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;