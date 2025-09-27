// client/src/components/AccountSettings.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FormInput from './FormInput';

const AccountSettings = () => {
  const { data: userProfile } = useSelector((state) => state.profile);
  
  const [details, setDetails] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
  });

  const handleDetailsChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    // Here we would dispatch an action to update the user details
    console.log('Updating details:', details);
    alert('Profile details updated!');
  };

  return (
    <div className="card p-4">
      <h4 className="mb-4">Profile Information</h4>
      <form onSubmit={handleDetailsSubmit}>
        <FormInput 
          label="Full Name" 
          type="text" 
          name="name" 
          value={details.name}
          onChange={handleDetailsChange}
        />
        <FormInput 
          label="Email Address" 
          type="email" 
          name="email" 
          value={details.email}
          // Email is typically not editable, so we can disable it
          // onChange={handleDetailsChange}
          // disabled 
        />
        <button type="submit" className="btn btn-primary-custom">Save Changes</button>
      </form>

      <hr className="my-5" />

      <h4 className="mb-4">Change Password</h4>
      <form>
        <FormInput label="Current Password" type="password" name="currentPassword" />
        <FormInput label="New Password" type="password" name="newPassword" />
        <FormInput label="Confirm New Password" type="password" name="confirmNewPassword" />
        <button type="submit" className="btn btn-primary-custom">Update Password</button>
      </form>
    </div>
  );
};

export default AccountSettings;