import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '../services/api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeDonationForm from '../components/StripeDonationForm';
import MilestoneProgress from './MilestoneProgress';
import './ProjectDetails.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const donorId = searchParams.get('donorId');
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [milestoneRefreshed, setMilestoneRefreshed] = useState(false);

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
  }, [projectId, milestoneRefreshed]);

  const handleDonationSuccess = () => {
    setMessage('Donation success!');
    setMilestoneRefreshed((prev) => !prev);
    setTimeout(() => {
      setShowPopup(true);
    }, 1000);
  };

  const handlePopupChoice = (choice) => {
    setShowPopup(false);
    if (choice === 'yes') {
      navigate('/projects/approvedProjectsList');
    } else {
      navigate(`/dashboard-donor/${donorId}`);
    }
  };

  const handleCancelDonation = () => {
    navigate(`/dashboard-donor/${donorId}`);
  };

  const isFundingComplete = project?.totalRaised >= project?.goalAmount;

  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="project-details-container">
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {project ? (
        <div className={`project-card ${isFundingComplete ? 'project-completed' : ''}`}>
          <div className="project-header">
            <h2 className="project-title">{project.campaignName}</h2>
            <div className="project-creator">by {project.creatorName || 'Unknown'}</div>
          </div>

          <div className="project-body">
            <div className="project-info">
              <div className="info-group">
                <span className="info-label">Fundraising Progress</span>
                <div className="total-raised">
                  ${project.totalRaised || 0}
                  <span className="goal-amount"> of ${project.goalAmount} goal</span>
                </div>
              </div>

              <div className="info-group">
                <span className="info-label">Description</span>
                <p className="project-description">{project.description}</p>
              </div>
            </div>

            {/* Portfolio Section */}
            {project.portfolio?.length > 0 && (
              <div className="portfolio-section">
                <h3>Portfolio</h3>
                <ul className="portfolio-list">
                  {project.portfolio.map((item, index) => (
                    <li key={index} className="portfolio-item">
                      {isImageFile(item) ? (
                        <img
                          src={item}
                          alt={`Portfolio item ${index + 1}`}
                          className="portfolio-image"
                        />
                      ) : (
                        <a href={item} target="_blank" rel="noopener noreferrer">
                          {item}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isFundingComplete && (
              <div className="donation-section">
                <Elements stripe={stripePromise}>
                  <StripeDonationForm
                    projectId={projectId}
                    donorId={donorId}
                    onSuccess={handleDonationSuccess}
                  />
                </Elements>
              </div>
            )}

            <div className="milestone-section">
              <MilestoneProgress
                projectId={projectId}
                milestoneRefreshed={milestoneRefreshed}
              />
            </div>
          </div>

          {/* Cancel Donation Button */}
          <div className="cancel-donation-section">
            <button
              className="cancel-donation-button"
              onClick={handleCancelDonation}
            >
              Cancel Donation
            </button>
          </div>
        </div>
      ) : (
        <div className="loading-state">Loading project details...</div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Do you want to see more projects?</p>
            <button onClick={() => handlePopupChoice('yes')}>Yes</button>
            <button onClick={() => handlePopupChoice('no')}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
