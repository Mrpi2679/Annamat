import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Annamat</h1>
        <p className="hero-tagline">Save Food. Save Money. Save the Planet.</p>
        <p className="hero-subtitle">
          A marketplace connecting restaurants with surplus food to customers at discounted prices.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn-primary">Browse Food</Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary">Get Started</Link>
              <Link to="/login" className="btn-secondary">Login</Link>
            </>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Restaurant Lists Surplus</h3>
            <p>Restaurants upload surplus food at discounted prices.</p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Customer Discovers</h3>
            <p>Browse nearby discounted food listings on your dashboard.</p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Reserve & Collect</h3>
            <p>Place an order and pick up the food before it goes to waste.</p>
          </div>
        </div>
      </section>

      <section className="sdg-section">
        <h2>Supporting UN Sustainable Development Goals</h2>
        <div className="sdg-grid">
          <div className="sdg-card"><strong>SDG 12</strong><br/>Responsible Consumption & Production</div>
          <div className="sdg-card"><strong>SDG 2</strong><br/>Zero Hunger</div>
          <div className="sdg-card"><strong>SDG 11</strong><br/>Sustainable Cities & Communities</div>
          <div className="sdg-card"><strong>SDG 13</strong><br/>Climate Action</div>
        </div>
      </section>
    </div>
  );
}
