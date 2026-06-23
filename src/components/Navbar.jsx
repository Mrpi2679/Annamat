import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Annamat</Link>
        <div className="navbar-links">
          <Link to="/dashboard">Browse Food</Link>
          {user ? (
            <>
              {user.role === 'restaurant' && (
                <>
                  <Link to="/add-listing">Add Listing</Link>
                  <Link to="/my-listings">My Listings</Link>
                </>
              )}
              <Link to="/my-orders">Orders</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-register-nav">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
