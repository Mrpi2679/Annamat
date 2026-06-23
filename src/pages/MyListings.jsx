import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function MyListings() {
  const [listings, setListings] = useState([]);

  async function fetchListings() {
    try {
      const res = await api.get('/food/my');
      setListings(res.data.listings);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { fetchListings(); }, []);

  async function toggleActive(listing) {
    await api.put(`/food/${listing._id}`, { isActive: !listing.isActive });
    fetchListings();
  }

  async function deleteListing(id) {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/food/${id}`);
    fetchListings();
  }

  return (
    <div className="my-listings">
      <div className="dashboard-header">
        <h2>My Listings</h2>
        <Link to="/add-listing" className="btn-primary">+ Add New</Link>
      </div>
      {listings.length === 0 ? (
        <p className="empty-state">No listings yet. Start by adding surplus food!</p>
      ) : (
        <div className="listings-table-wrapper">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id}>
                  <td>{l.title}</td>
                  <td>₹{l.discountedPrice}</td>
                  <td>{l.quantity} {l.unit}</td>
                  <td>{l.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="actions-cell">
                    <button onClick={() => toggleActive(l)} className="btn-sm">
                      {l.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => deleteListing(l._id)} className="btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
