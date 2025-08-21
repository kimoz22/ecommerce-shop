import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import ProductInput from './ProductInput';

const UserProfile = ({ username, setIsLoggedIn }) => {
  const [userData, setUserData] = useState({
    name: username || 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Street, New York, NY 10001',
    memberSince: 'January 2024',
    orders: 12,
    wishlist: 8,
    totalSpent: 1250.00
  });

  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 2
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'In Transit',
      total: 156.50,
      items: 3
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 45.00,
      items: 1
    }
  ]);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Manage your profile, orders, and preferences</p>
      </div>

      <div className="profile-content">
        {/* User Info Card */}
        <div className="profile-card">
          <div className="user-info-section">
            <div className="user-avatar-large">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="user-details">
              <h2>{userData.name}</h2>
              <p>{userData.email}</p>
              <p>Member since {userData.memberSince}</p>
            </div>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{userData.orders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{userData.wishlist}</h3>
              <p>Wishlist Items</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>${userData.totalSpent.toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/orders" className="action-btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              View Orders
            </Link>
            <Link to="/wishlist" className="action-btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Wishlist
            </Link>
            <Link to="/addresses" className="action-btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Addresses
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <h4>{order.id}</h4>
                  <p>{order.date}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-total">
                  <p>${order.total}</p>
                  <small>{order.items} items</small>
                </div>
                <Link to={`/orders/${order.id}`} className="view-order-btn">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="account-settings">
          <h3>Account Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <h4>Personal Information</h4>
              <p>Update your name, email, and phone number</p>
              <button className="setting-btn">Update</button>
            </div>
            <div className="setting-item">
              <h4>Password</h4>
              <p>Change your password for security</p>
              <button className="setting-btn">Change</button>
            </div>
            <div className="setting-item">
              <h4>Email Preferences</h4>
              <p>Manage your email notifications</p>
              <button className="setting-btn">Manage</button>
            </div>
            <div className="setting-item">
              <h4>Privacy</h4>
              <p>Control your privacy settings</p>
              <button className="setting-btn">Settings</button>
            </div>
          </div>
        </div>

        {/* Product Management - InputProductList */}
        <div className="product-management">
          <h3>Product Management</h3>
          <div className="product-input-section">
            <ProductInput/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
