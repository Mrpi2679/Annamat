import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', originalPrice: '', discountedPrice: '',
    quantity: 1, unit: 'plate', category: 'meal', pickupTime: '', imageUrl: ''
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/food', {
        ...form,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        quantity: Number(form.quantity)
      });
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Add Food Listing</h2>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Original Price (₹)</label>
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Discounted Price (₹)</label>
              <input name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="plate">Plate</option>
                <option value="kg">Kg</option>
                <option value="piece">Piece</option>
                <option value="litre">Litre</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="meal">Meal</option>
                <option value="bakery">Bakery</option>
                <option value="snack">Snack</option>
                <option value="beverage">Beverage</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pickup Time</label>
              <input name="pickupTime" value={form.pickupTime} onChange={handleChange} placeholder="e.g. 6-8 PM" />
            </div>
          </div>
          <button type="submit" className="btn-primary form-btn">Create Listing</button>
        </form>
      </div>
    </div>
  );
}
