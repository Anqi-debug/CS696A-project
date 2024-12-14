import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardCreator = () => {
  const { id: userId } = useParams(); // Get userId from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Connect to the WebSocket server

    // Register the user with their ID
    if (userId) {
      console.log(`Registering user with ID: ${userId}`);
      socket.emit('register', userId);
    } else {
      console.error('User ID is undefined');
    }

    // Fetch past notifications
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

    // Listen for live notifications
    socket.on('notification', (notification) => {
      console.log('Notification received:', notification);
      setNotifications((prev) => [notification, ...prev]); // Prepend new notifications
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Mark a notification as read and remove it from the list
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`); // Mark notification as read
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read.');
    }
  };

  // Navigate to the "Create Fundraiser" page
  const handleNavigateToCreateFundraiser = () => {
    navigate('/projects/recurring-fundraiser');
  };

  return (
    <div>
      <div>
        <h1>Creator Dashboard</h1>
        <button onClick={handleNavigateToCreateFundraiser}>
          Create a New Recurring Fundraiser
        </button>
      </div>
      <h2>Notifications</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <strong>{notif.message}</strong> <br />
              <small>
                {notif.timestamp
                  ? new Date(notif.timestamp).toLocaleString()
                  : 'No timestamp available'}
              </small>
              <button
                onClick={() => markAsRead(notif._id)}
                style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Close
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardCreator;
