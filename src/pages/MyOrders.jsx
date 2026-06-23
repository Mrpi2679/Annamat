import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id, status) {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  }

  return (
    <div className="my-orders">
      <h2>{user?.role === 'restaurant' ? 'Orders Received' : 'My Orders'}</h2>
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <span className="order-title">{order.listing?.title || 'Food Item'}</span>
                <span className={`order-status status-${order.status}`}>{order.status}</span>
              </div>
              <div className="order-card-body">
                <p>Quantity: {order.quantity}</p>
                <p>Total: ₹{order.totalPrice}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              {user?.role === 'restaurant' && order.status === 'pending' && (
                <div className="order-card-actions">
                  <button onClick={() => updateStatus(order._id, 'confirmed')} className="btn-sm btn-success">Confirm</button>
                  <button onClick={() => updateStatus(order._id, 'cancelled')} className="btn-sm btn-danger">Cancel</button>
                </div>
              )}
              {user?.role === 'restaurant' && order.status === 'confirmed' && (
                <div className="order-card-actions">
                  <button onClick={() => updateStatus(order._id, 'completed')} className="btn-sm btn-success">Mark Completed</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
