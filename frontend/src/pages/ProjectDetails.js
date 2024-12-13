import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProjectById } from '../services/api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeDonationForm from '../components/StripeDonationForm';
import MilestoneProgress from './MilestoneProgress';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const donorId = searchParams.get('donorId'); // Retrieve donorId from query params
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(projectId);
        setProject(response.data.project);
      } catch (err) {
        setError('Failed to fetch project details.');
      }
    };

    fetchProject();
  }, [projectId]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {project ? (
        <div>
          <h2>{project.campaignName}</h2>
          <p>Creator: {project.creatorId?.name || 'Unknown'}</p>
          <p>Description: {project.description}</p>
          <p>Goal Amount: ${project.goalAmount}</p>
          <p>Status: {project.status}</p>
          <p>Funds Raised: ${project.fundsRaised || 0}</p>
          <MilestoneProgress projectId={projectId} />
          <Elements stripe={stripePromise}>
            <StripeDonationForm projectId={projectId} donorId={donorId} />
          </Elements>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetails;
