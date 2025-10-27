import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css'
export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className="not-found-wrapper">
      <div className="not-found-card">
        <h1 className="title">404</h1>
        <p className="subtitle">Oops! Page not found.</p>
        <p className="hint">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <button className="home-btn" onClick={() => nav('/')}>
          Go Home
        </button>
      </div>
    </div>
  );
}