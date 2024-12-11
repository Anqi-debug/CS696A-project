import React, { useState } from 'react';
import { createRecurringFundraiser } from '../services/api';

const CreateFundraiserForm = () => {
  const [formData, setFormData] = useState({
    creatorId: '',
    campaignName: '',
    description: '',
    monthlyGoal: '',
    goalAmount: '',
    projectTimeline: '',
    status: 'Pending',
    portfolio: [], // Array to store files
    //fundsRaised: 0,
    //donorCount: 0,
    //investmentTerms: '',
    frequency: 'Monthly',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError('You can upload up to 5 files only.');
      return;
    }

    setFormData({ ...formData, portfolio: files });
    setError(''); // Clear error if valid
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    for (let key in formData) {
      if (key === 'portfolio') {
        formData.portfolio.forEach((file) => data.append('portfolio', file));
      } else {
        data.append(key, formData[key]);
      }
    }
  
    // Debug: Log FormData contents
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await createRecurringFundraiser(data);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating fundraiser');
    }
  };

  return (
    <div>
      <h2>Create Recurring Fundraiser</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="creatorId"
          placeholder="Creator ID"
          value={formData.creatorId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="campaignName"
          placeholder="Campaign Name"
          value={formData.campaignName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="monthlyGoal"
          placeholder="Monthly Goal"
          value={formData.monthlyGoal}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="goalAmount"
          placeholder="Goal Amount"
          value={formData.goalAmount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="projectTimeline"
          placeholder="Project Timeline"
          value={formData.projectTimeline}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
        />
        <label>
          Portfolio (Upload up to 5 files):
          <input
            type="file"
            name="portfolio"
            accept="image/*" // Restrict to image files; remove for general files
            multiple
            onChange={handleFileChange}
          />
        </label>
        <select name="frequency" value={formData.frequency} onChange={handleChange}>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateFundraiserForm;
