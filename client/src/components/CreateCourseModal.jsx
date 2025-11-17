// client/src/components/CreateCourseModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Loader2 } from 'lucide-react';
import FormInput from './FormInput';
import { fetchSkills } from '../redux/skillsSlice';
import { fetchTrainerCourses } from '../redux/coursesSlice'; // Import refetch thunk
import toast from 'react-hot-toast';
import api from '../services/api'; 

const CreateCourseModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { items: skills, status: skillsStatus } = useSelector((state) => state.skills);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        teachingHours: 10, // NEW FIELD: Default
        skill: '', // skillId
        image: 'https://via.placeholder.com/400x200.png?text=New+Course', // Default image
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch skills if not already loaded (for the category dropdown)
    useEffect(() => {
        if (skillsStatus === 'idle' && isOpen) {
            dispatch(fetchSkills());
        }
    }, [skillsStatus, dispatch, isOpen]);
    
    // Set default skill after fetching
    useEffect(() => {
        if (skillsStatus === 'succeeded' && skills.length > 0 && !formData.skill) {
            setFormData(prev => ({ ...prev, skill: skills[0].id.toString() }));
        }
    }, [skillsStatus, skills, formData.skill]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "Title is required.";
        if (!formData.description) newErrors.description = "Description is required.";
        if (parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than zero.";
        if (parseInt(formData.teachingHours) <= 0) newErrors.teachingHours = "Teaching hours must be greater than zero."; // NEW VALIDATION
        if (!formData.skill) newErrors.skill = "A skill category must be selected.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        try {
            // API call to create course
            await api.post('/courses', {
                ...formData,
                price: parseFloat(formData.price), // Ensure price is float
                teachingHours: parseInt(formData.teachingHours), // NEW DATA
                skill: parseInt(formData.skill), // Ensure skill is integer
            });
            
            toast.success("Course created successfully!");
            // Dispatch refetch to update the dashboard's course list
            dispatch(fetchTrainerCourses()); 
            onClose(); // Close modal on success
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create course.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content rounded-3 shadow-lg">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Create New Course</h5>
                        <button type="button" className="btn-close" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <FormInput 
                                label="Course Title" type="text" name="title" 
                                value={formData.title} onChange={handleChange} error={errors.title}
                            />
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label fw-semibold">Description</label>
                                <textarea id="description" name="description" className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows="3" value={formData.description} onChange={handleChange}></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                            
                            {/* NEW: Teaching Hours Input */}
                            <FormInput 
                                label="Teaching Hours" type="number" name="teachingHours" 
                                value={formData.teachingHours} onChange={handleChange} error={errors.teachingHours}
                            />
                            
                            <FormInput 
                                label="Price (₹)" type="number" name="price" 
                                value={formData.price} onChange={handleChange} error={errors.price}
                            />
                            <div className="mb-3">
                                <label htmlFor="skill" className="form-label fw-semibold">Category (Skill)</label>
                                <select 
                                    id="skill" name="skill" 
                                    className={`form-select ${errors.skill ? 'is-invalid' : ''}`}
                                    value={formData.skill} 
                                    onChange={handleChange}
                                >
                                    {skillsStatus === 'loading' && <option>Loading Skills...</option>}
                                    {skillsStatus === 'succeeded' && skills.map(skill => (
                                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                                    ))}
                                </select>
                                {errors.skill && <div className="invalid-feedback">{errors.skill}</div>}
                            </div>
                            <FormInput 
                                label="Image URL" type="url" name="image" 
                                value={formData.image} onChange={handleChange} error={errors.image}
                            />

                            <button type="submit" className="btn btn-primary-custom w-100 mt-4" disabled={isLoading}>
                                {isLoading ? <><Loader2 size={20} className="animate-spin me-2" /> Publishing Course...</> : 'Publish Course'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourseModal;