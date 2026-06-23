import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Create Account</h2>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          <div className="form-group">
            <label>I am a</label>
            <div className="role-toggle">
              <button type="button" className={role === 'customer' ? 'active' : ''} onClick={() => setRole('customer')}>Customer</button>
              <button type="button" className={role === 'restaurant' ? 'active' : ''} onClick={() => setRole('restaurant')}>Restaurant</button>
            </div>
          </div>
          <button type="submit" className="btn-primary form-btn">Register</button>
        </form>
        <p className="form-footer">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
