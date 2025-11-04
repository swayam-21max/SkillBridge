// client/src/pages/CoursesPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/coursesSlice';
import CourseCard from '../components/CourseCard';
import './CoursesPage.css'; // Import the new styles

const CoursesPage = () => {
  const dispatch = useDispatch();
  const { all: courses, status: courseStatus, error } = useSelector((state) => state.courses);

  useEffect(() => {
    // Fetch courses only if they haven't been fetched yet
    if (courseStatus === 'idle') {
      dispatch(fetchCourses());
    }
  }, [courseStatus, dispatch]);

  const renderCourses = () => {
    if (courseStatus === 'loading') {
      return <div className="text-center">Loading courses...</div>; // You can replace this with your Loader component
    }

    if (courseStatus === 'failed') {
      return <div className="alert alert-danger">{error || 'Failed to load courses.'}</div>;
    }

    if (courseStatus === 'succeeded' && courses.length === 0) {
        return <div className="text-center">No courses found.</div>;
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
              <div className="filter-group">
                <h5 className="fw-bold mb-3">Search</h5>
                <input type="text" className="form-control" placeholder="Search courses..." />
              </div>
              <div className="filter-group">
                <h5 className="fw-bold mb-3">Sort By</h5>
                <select className="form-select">
                  <option value="popular">Most Popular</option>
                  <option value="rated">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <div className="filter-group">
                <h5 className="fw-bold mb-3">Category</h5>
                {/* Categories will be dynamic later */}
                <div className="form-check"><input className="form-check-input" type="checkbox" id="cat1" /><label className="form-check-label" htmlFor="cat1">Web Development</label></div>
                <div className="form-check"><input className="form-check-input" type="checkbox" id="cat2" /><label className="form-check-label" htmlFor="cat2">Design</label></div>
              </div>
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