import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function FoodCard({ listing, onOrder }) {
  const { user } = useAuth();
  const discount = Math.round((1 - listing.discountedPrice / listing.originalPrice) * 100);

  async function handleOrder() {
    try {
      const res = await api.post('/orders', { listingId: listing._id, quantity: 1 });
      if (onOrder) onOrder(res.data.order);
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  }

  return (
    <div className="food-card">
      <div className="food-card-badge">{discount}% OFF</div>
      <div className="food-card-body">
        <h3 className="food-card-title">{listing.title}</h3>
        <p className="food-card-restaurant">{listing.restaurantName}</p>
        <p className="food-card-desc">{listing.description}</p>
        <div className="food-card-details">
          <span className="food-card-qty">{listing.quantity} {listing.unit}(s)</span>
          <span className="food-card-category">{listing.category}</span>
        </div>
        {listing.pickupTime && (
          <p className="food-card-pickup">Pickup: {listing.pickupTime}</p>
        )}
        <div className="food-card-pricing">
          <span className="food-card-price">₹{listing.discountedPrice}</span>
          <span className="food-card-original">₹{listing.originalPrice}</span>
        </div>
        {user?.role === 'customer' && (
          <button onClick={handleOrder} className="btn-primary food-card-btn">
            Reserve Now
          </button>
        )}
      </div>
    </div>
  );
}
