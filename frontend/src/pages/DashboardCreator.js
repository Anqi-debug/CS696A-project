import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardCreator.css';

const DashboardCreator = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    if (userId) {
      console.log(`Registering user with ID: ${userId}`);
      socket.emit('register', userId);
    } else {
      console.error('User ID is undefined');
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications/user/${userId}`);
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      }
    };

    fetchNotifications();

    socket.on('notification', (notification) => {
      console.log('Notification received:', notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read.');
    }
  };

  const handleNavigateToCreateFundraiser = () => {
    navigate('/projects/recurring-fundraiser');
  };

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        <button 
          className="create-fundraiser-btn"
          onClick={handleNavigateToCreateFundraiser}
        >
          Create a New Recurring Fundraiser
        </button>
      </div>

      <div className="notifications-section">
        <div className="notifications-header">
          <h2>Notifications</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        {notifications.length === 0 ? (
          <div className="empty-notifications">No notifications yet.</div>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notif) => (
              <li key={notif._id} className="notification-item">
                <div className="notification-content">
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-timestamp">
                    {notif.timestamp
                      ? new Date(notif.timestamp).toLocaleString()
                      : 'No timestamp available'}
                  </div>
                </div>
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="close-notification-btn"
                >
                  Close
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardCreator;
