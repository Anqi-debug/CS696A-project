import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardCreator.css';

const DashboardCreator = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('notifications'); // Set initial tab to "notifications"
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    if (userId) {
      socket.emit('register', userId);
    } else {
      console.error('User ID is undefined');
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notifications/user/${userId}`);
        const unreadNotifications = response.data.filter((notif) => !notif.isRead);
        setNotifications(unreadNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      }
    };

    fetchNotifications();

    socket.on('notification', (notification) => {
      if (!notification.isRead) {
        setNotifications((prev) => [notification, ...prev]);
      }
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

  const handleNavigateToProjects = () => {
    navigate(`/projects/creator/${userId}`);
  };

  const handleNavigateToEditProfile = () => {
    navigate(`/users/${userId}/portfolio`);
  };

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
      </div>

      <div className="dashboard-flex-container">
        <div
          className="dashboard-card"
          onClick={handleNavigateToCreateFundraiser}
        >
          <h3 className="card-title">Create a New Recurring Fundraiser</h3>
          <div className="card-content">
            Start a new fundraising campaign to support your projects.
          </div>
        </div>

        <div className="dashboard-card" onClick={handleNavigateToEditProfile}>
          <h3 className="card-title">Profile Edit</h3>
          <div className="card-content">
            Update your portfolio and social media links.
          </div>
        </div>

        <div
          className="dashboard-card"
          onClick={() => setActiveTab('notifications')}
        >
          <h3 className="card-title">Notifications</h3>
          <div className="card-content">
            {notifications.length > 0
              ? `You have ${notifications.length} unread notifications`
              : 'No new notifications'}
          </div>
        </div>

        <div className="dashboard-card" onClick={handleNavigateToProjects}>
          <h3 className="card-title">Your Projects</h3>
          <div className="card-content">
            View and manage all of your fundraising projects.
          </div>
        </div>
      </div>

      {activeTab === 'notifications' && (
        <div className="notifications-section">
          <div className="notifications-header">
            <h2>Notifications</h2>
          </div>
          {error && <div className="error-message">{error}</div>}
          {notifications.length === 0 ? (
            <div className="empty-notifications">No new notifications.</div>
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
      )}
    </div>
  );
};

export default DashboardCreator;
