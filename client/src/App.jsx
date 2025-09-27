import {BrowserRouter as Router, Routes, Route}from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Register';
import CoursesPage from './pages/Courses';
import ProfilePage from './pages/Profile';
import AboutPage from './pages/AboutPage';


function App() {
  return (
    <Router>
      {/* Wrapper div for the sticky footer layout */}
      <div className="d-flex flex-column min-vh-100">
        <Header /> {/* Using the new Header component */}
        
        {/* Main content area that will expand */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        
        <Footer /> {/* Footer is placed here to stick to the bottom */}
      </div>
    </Router>
  );
}

export default App;