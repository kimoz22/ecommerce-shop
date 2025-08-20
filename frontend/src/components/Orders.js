import React from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.99,
      items: 2,
      products: [
        { name: 'Men\'s Casual Shirt', price: 45.99, quantity: 1 },
        { name: 'Women\'s Summer Dress', price: 44.00, quantity: 1 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'In Transit',
      total: 156.50,
      items: 3,
      products: [
        { name: 'Nike Air Max', price: 89.99, quantity: 1 },
        { name: 'Adidas T-Shirt', price: 35.00, quantity: 2 }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 45.00,
      items: 1,
      products: [
        { name: 'Classic Jeans', price: 45.00, quantity: 1 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#22c55e';
      case 'in transit':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>Placed on {order.date}</p>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.products.map((product, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <strong>Total: ${order.total.toFixed(2)}</strong>
              </div>
              <div className="order-actions">
                <Link to={`/orders/${order.id}`} className="view-details-btn">
                  View Details
                </Link>
                {order.status === 'Delivered' && (
                  <button className="reorder-btn">Reorder</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
