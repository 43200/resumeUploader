import React, { useState } from 'react';
import './ResumeUploadForm.css';

function ResumeUploadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'Fresher',
    role: '',
    resume: null,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {  // 2MB size limit
      setMessage('File size should be under 2 MB.');
      setFormData((prev) => ({ ...prev, resume: null }));
      e.target.value = null; // reset file input
    } else {
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setMessage('Please upload a resume file.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('email', formData.email);
      uploadData.append('phone', formData.phone);
      uploadData.append('experience', formData.experience);
      uploadData.append('role', formData.role);
      uploadData.append('resume', formData.resume);

      const res = await fetch('http://localhost:5000', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const result = await res.json();
      setMessage(result.message || 'Upload successful!');

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: 'Fresher',
        role: '',
        resume: null,
      });
    } catch (err) {
      console.error('Error uploading:', err);
      setMessage('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-form-container">
      <img src="/logo.png" alt="Company Logo" className="logo" />
      <h1>Smart Resume Screening – Upload Your Resume</h1>
      <p>Let our AI handle the screening while you focus on choosing the right talent.</p>

      <form onSubmit={handleSubmit}>
        <label>Candidate Name*</label>
        <input
          type="text"
          name="name"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email*</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Upload Resume*</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.docx"
          required
          onChange={handleFileChange}
        />

        <label>Experience Level</label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option>Fresher</option>
          <option>0–2 yrs</option>
          <option>2–5 yrs</option>
          <option>5+ yrs</option>
        </select>

        <label>Role Applied For</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload & Analyze Resume'}
        </button>
      </form>

      {message && (
        <p style={{ color: message === 'Upload failed.' || message === 'File size should be under 2 MB.' ? 'red' : 'green' }}>
          {message}
        </p>
      )}

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
