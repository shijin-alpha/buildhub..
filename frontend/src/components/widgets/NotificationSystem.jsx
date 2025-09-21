import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { MdAdminPanelSettings, MdDesignServices, MdConstruction, MdMessage, MdPayment, MdWarning, MdCheckCircle } from 'react-icons/md';
import '../../styles/Widgets.css';

const NotificationSystem = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications from API based on userId
  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      try {
        // In a real implementation, this would be an API call like:
        // const response = await fetch(`/api/notifications/${userId}`);
        // const data = await response.json();
        
        // For demonstration, simulate different types of notifications
        // This will be replaced with actual API data in production
        const userNotifications = [
          {
            id: 1,
            type: 'admin',
            message: 'Your account has been verified successfully',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            actionUrl: '#/account',
            sender: 'BuildHub Admin'
          },
          {
            id: 2,
            type: 'design',
            message: 'New design proposal is ready for your review',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: false,
            actionUrl: '#/designs',
            sender: 'Design Team'
          },
          {
            id: 3,
            type: 'project',
            message: 'Project milestone completed: Foundation work',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            read: true,
            actionUrl: '#/projects',
            sender: 'Project Manager'
          },
          {
            id: 4,
            type: 'message',
            message: 'You have a new message from your architect',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            read: true,
            actionUrl: '#/messages',
            sender: 'John Architect'
          }
        ];
        
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    
    // Set up polling for new notifications
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [userId]);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'design': return <MdDesignServices />;
      case 'project': return <MdConstruction />;
      case 'request': return <MdMessage />;
      case 'message': return <MdMessage />;
      case 'admin': return <MdAdminPanelSettings />;
      case 'payment': return <MdPayment />;
      case 'alert': return <MdWarning />;
      case 'success': return <MdCheckCircle />;
      default: return <FaBell />;
    }
  };
  
  // Get color based on notification type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'design': return '#4f46e5'; // indigo
      case 'project': return '#0891b2'; // cyan
      case 'request': return '#ca8a04'; // yellow
      case 'message': return '#16a34a'; // green
      case 'admin': return '#9333ea'; // purple
      case 'payment': return '#15803d'; // green
      case 'alert': return '#dc2626'; // red
      case 'success': return '#16a34a'; // green
      default: return '#6b7280'; // gray
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  };

  // This function would be implemented when the API is ready
  // It would handle marking notifications as read and updating the UI

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="notification-system">
      <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
        <span className="bell-icon"><FaBell /></span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
      
      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-actions">
              <button className="btn-text" onClick={markAllAsRead}>Mark all as read</button>
              <button className="btn-text" onClick={() => setShowNotifications(false)}>Close</button>
            </div>
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <div className="empty-icon"><FaBell style={{ opacity: 0.5 }} /></div>
                <div className="empty-text">No notifications available</div>
                <div className="empty-subtext">We'll notify you when something new arrives</div>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => {
                    markAsRead(notification.id);
                    window.location.href = notification.actionUrl;
                  }}
                >
                  <div 
                    className="notification-icon"
                    style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}
                  >
                    <span style={{ color: getNotificationColor(notification.type) }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-meta">
                      <span className="notification-sender">{notification.sender}</span>
                      <span className="notification-time">{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                  </div>
                  {!notification.read && <div className="unread-indicator" style={{ backgroundColor: getNotificationColor(notification.type) }}></div>}
                </div>
              ))
            )}
          </div>
          
          <div className="notifications-footer">
            <button className="btn-secondary" onClick={() => setShowNotifications(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;