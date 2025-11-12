// client/src/pages/CoursesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/coursesSlice';
import { fetchSkills } from '../redux/skillsSlice'; // Import the new skills thunk
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import { Search, RotateCcw } from 'lucide-react';
import './CoursesPage.css';

// Utility function to debounce API calls
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const CoursesPage = () => {
  const dispatch = useDispatch();
  const { all: courses, status: courseStatus, error: courseError } = useSelector((state) => state.courses);
  const { items: skills, status: skillsStatus } = useSelector((state) => state.skills);

  // --- Filter State Management ---
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'newest',
    skillId: '', // Filter by skill ID
  });

  // Function to fetch courses based on current filters
  const fetchCoursesWithFilters = useCallback((currentFilters) => {
    // Only pass non-empty filters to the API
    const params = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, v]) => v)
    );
    dispatch(fetchCourses(params));
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }, 500),
    []
  );

  // --- Initial Data Fetch (Courses and Skills) ---
  useEffect(() => {
    // Fetch skills for the sidebar if needed
    if (skillsStatus === 'idle') {
      dispatch(fetchSkills());
    }
  }, [skillsStatus, dispatch]);
  
  // Effect to refetch courses whenever filters change
  useEffect(() => {
    // Only refetch if the skill list has loaded or if we are not loading.
    if (skillsStatus === 'succeeded' || courseStatus !== 'loading') {
        fetchCoursesWithFilters(filters);
    }
  }, [filters, fetchCoursesWithFilters, skillsStatus]);


  // --- Event Handlers ---
  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  const handleSkillChange = (e) => {
    // If the selected skill is already active, clicking it again will clear the filter.
    const newSkillId = e.target.checked ? e.target.value : '';
    setFilters(prev => ({ ...prev, skillId: newSkillId }));
  };
  
  const handleSearchChange = (e) => {
    // Update local filters immediately, then trigger the debounced search
    const searchQuery = e.target.value;
    setFilters(prev => ({ ...prev, search: searchQuery })); // Update the state immediately for controlled input
    debouncedSearch(searchQuery); // Debounced call to trigger useEffect
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'newest',
      skillId: '',
    });
    // The useEffect hook above will automatically refetch the data
  };

  // --- Render Logic ---
  const renderCourses = () => {
    if (courseStatus === 'loading') {
      return <div className="text-center py-5"><Loader /></div>;
    }

    if (courseStatus === 'failed') {
      return <div className="alert alert-danger">{courseError || 'Failed to load courses.'}</div>;
    }

    if (courseStatus === 'succeeded' && courses.length === 0) {
        return <div className="text-center py-5"><p className="lead">No courses found matching your criteria.</p></div>;
    }

    return (
      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-lg-4 col-md-6" key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    );
  };
  
  const isFilterActive = filters.search || filters.sortBy !== 'newest' || filters.skillId;
  
  return (
    <div className="courses-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Explore Our Courses</h1>
          <p className="text-muted">Find the perfect course to help you achieve your goals.</p>
        </div>
        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <aside className="filters-sidebar">
              <h4 className="fw-bold mb-4">Filter Courses</h4>

              <div className="filter-group">
                <h5 className="fw-bold mb-3">Search</h5>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search titles or trainers..." 
                    onChange={handleSearchChange} // Use local change handler
                    value={filters.search}
                  />
                  <span className="input-group-text"><Search size={20} /></span>
                </div>
              </div>
              
              <div className="filter-group">
                <h5 className="fw-bold mb-3">Sort By</h5>
                <select className="form-select" value={filters.sortBy} onChange={handleSortChange}>
                  <option value="newest">Newest</option>
                  <option value="rated">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <div className="filter-group">
                <h5 className="fw-bold mb-3">Category (Skills)</h5>
                
                {skillsStatus === 'loading' && <div>Loading categories...</div>}
                {skillsStatus === 'failed' && <div className="text-danger small">Failed to load categories.</div>}
                
                {skillsStatus === 'succeeded' && skills.map(skill => (
                  <div className="form-check" key={skill.id}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="skillFilter" 
                      id={`skill-${skill.id}`} 
                      value={skill.id.toString()}
                      checked={filters.skillId === skill.id.toString()}
                      onChange={handleSkillChange} 
                    />
                    <label className="form-check-label" htmlFor={`skill-${skill.id}`}>{skill.name}</label>
                  </div>
                ))}
              </div>
              
              {isFilterActive && (
                <button className="btn btn-outline-danger w-100" onClick={handleClearFilters}>
                  <RotateCcw size={18} className="me-2" />Clear Filters
                </button>
              )}
            </aside>
          </div>

          {/* Courses Grid */}
          <div className="col-lg-9">
            {renderCourses()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;