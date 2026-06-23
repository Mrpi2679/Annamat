import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import api from '../utils/api';

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('');

  async function fetchListings() {
    try {
      const params = filter ? { category: filter } : {};
      const res = await api.get('/food', { params });
      setListings(res.data.listings);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { fetchListings(); }, [filter]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Available Surplus Food</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">All Categories</option>
          <option value="meal">Meals</option>
          <option value="bakery">Bakery</option>
          <option value="snack">Snacks</option>
          <option value="beverage">Beverages</option>
          <option value="other">Other</option>
        </select>
      </div>
      {listings.length === 0 ? (
        <p className="empty-state">No food listings available right now. Check back later!</p>
      ) : (
        <div className="food-grid">
          {listings.map((listing) => (
            <FoodCard key={listing._id} listing={listing} onOrder={fetchListings} />
          ))}
        </div>
      )}
    </div>
  );
}
