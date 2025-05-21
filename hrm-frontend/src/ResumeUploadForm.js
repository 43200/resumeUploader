import React, { useState } from 'react';
import './ResumeUploadForm.css';

function ResumeUploadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    role: '',
    resume: null,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('email', formData.email);
    uploadData.append('phone', formData.phone);
    uploadData.append('experience', formData.experience);
    uploadData.append('role', formData.role);
    uploadData.append('resume', formData.resume);

    try {
      const res = await fetch('http://localhost:5000/upload-resume', {
        method: 'POST',
        body: uploadData,
      });

      const result = await res.json();
      setMessage(result.message || 'Upload successful!');
    } catch (err) {
      console.error('Error uploading:', err);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="resume-form-container">
      <img src="/logo.png" alt="Company Logo" className="logo" />
      <h1>Smart Resume Screening – Upload Your Resume</h1>
      <p>Let our AI handle the screening while you focus on choosing the right talent.</p>

      <form onSubmit={handleSubmit}>
        <label>Candidate Name*</label>
        <input type="text" name="name" required onChange={handleChange} />

        <label>Email*</label>
        <input type="email" name="email" required onChange={handleChange} />

        <label>Phone Number</label>
        <input type="text" name="phone" onChange={handleChange} />

        <label>Upload Resume*</label>
        <input type="file" name="resume" accept=".pdf,.docx" required onChange={handleFileChange} />

        <label>Experience Level</label>
        <select name="experience" onChange={handleChange}>
          <option>Fresher</option>
          <option>0–2 yrs</option>
          <option>2–5 yrs</option>
          <option>5+ yrs</option>
        </select>

        <label>Role Applied For</label>
        <input type="text" name="role" onChange={handleChange} />

        <button type="submit">Upload & Analyze Resume</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div className="instructions-box">
        <h3>Resume Upload Guidelines:</h3>
        <ul>
          <li>Supported formats: .pdf, .docx</li>
          <li>Keep your resume under 2 MB</li>
          <li>Include contact info, education, experience, and skills</li>
          <li>AI will match your resume with role requirements</li>
          <li>You’ll receive a confirmation after successful upload</li>
        </ul>
      </div>
    </div>
  );
}

export default ResumeUploadForm;
