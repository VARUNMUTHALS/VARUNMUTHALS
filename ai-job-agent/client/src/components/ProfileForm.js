import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    education: '',
    skills: [],
    linkedin: '',
    role: '',
    experienceLevel: 'Fresher',
    yearsOfExperience: 0,
    resume: null,
    profileImage: null,
    github: '',
    portfolio: '',
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/profile`, formData);
      console.log('Profile created:', res.data);
      alert('Profile created successfully!');
    } catch (err) {
      console.error(err.response.data);
      alert('Error creating profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Profile</h2>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Mobile Number:</label>
      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} />

      <label>Education:</label>
      <input type="text" name="education" value={formData.education} onChange={handleChange} />

      <label>Skills (comma-separated):</label>
      <input type="text" name="skills" onChange={(e) => setFormData({...formData, skills: e.target.value.split(',')})} />

      <label>LinkedIn Profile:</label>
      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />

      <label>Role / Interest:</label>
      <input type="text" name="role" value={formData.role} onChange={handleChange} />

      <label>Experience Level:</label>
      <div>
        <label>
          <input type="radio" name="experienceLevel" value="Fresher" checked={formData.experienceLevel === 'Fresher'} onChange={handleChange} />
          Fresher
        </label>
        <label>
          <input type="radio" name="experienceLevel" value="Experienced" checked={formData.experienceLevel === 'Experienced'} onChange={handleChange} />
          Experienced
        </label>
      </div>

      {formData.experienceLevel === 'Experienced' && (
        <div>
          <label>Years of Experience:</label>
          <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />
        </div>
      )}

      <label>Resume (PDF/DOCX):</label>
      <input type="file" name="resume" accept=".pdf,.docx" onChange={handleFileChange} />

      <label>Profile Image:</label>
      <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />

      <label>GitHub Link:</label>
      <input type="url" name="github" value={formData.github} onChange={handleChange} />

      <label>Portfolio Link:</label>
      <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} />

      <label>Personal Website:</label>
      <input type="url" name="website" value={formData.website} onChange={handleChange} />

      <button type="submit">Save & Continue</button>
    </form>
  );
};

export default ProfileForm;
