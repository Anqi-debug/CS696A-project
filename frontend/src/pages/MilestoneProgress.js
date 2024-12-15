import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from '../services/api';
import './MilestoneProgress.css';

const MilestoneProgress = ({ projectId, milestoneRefreshed }) => {
  const [milestones, setMilestones] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(`/projects/${projectId}/milestones`);
        setMilestones(response.data.milestones);
      } catch (err) {
        setError('Failed to load milestones');
        console.error('Error fetching milestones:', err);
      }
    };

    fetchMilestones();
  }, [projectId, milestoneRefreshed]); // Refresh when `milestoneRefreshed` changes

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!milestones) {
    return <p>Loading milestones...</p>;
  }

  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
      <div style={{ width: '150px' }}>
        <h3>Monthly Goal</h3>
        <CircularProgressbar
          value={milestones.achievedMonthly}
          text={`${Math.round(milestones.achievedMonthly)}%`}
          styles={buildStyles({
            textColor: '#f88',
            pathColor: '#f88',
            trailColor: '#d6d6d6',
          })}
        />
        <p>${milestones.fundsRaised} / ${milestones.monthlyGoal}</p>
      </div>

      <div style={{ width: '150px' }}>
        <h3>Total Goal</h3>
        <CircularProgressbar
          value={milestones.achievedTotal}
          text={`${Math.round(milestones.achievedTotal)}%`}
          styles={buildStyles({
            textColor: '#4caf50',
            pathColor: '#4caf50',
            trailColor: '#d6d6d6',
          })}
        />
        <p>${milestones.totalRaised} / ${milestones.goalAmount}</p>
      </div>
    </div>
  );
};

export default MilestoneProgress;
