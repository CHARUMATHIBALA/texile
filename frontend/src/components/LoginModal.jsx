export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  if (!isOpen) return null;

  const handleSwitch = (e) => {
    e.preventDefault();
    onClose();
    if (onSwitchToSignup) {
      setTimeout(() => onSwitchToSignup(), 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI only - no backend
    alert('Login functionality - UI only');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Login</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="modal-submit-btn">Login</button>
          <p className="modal-footer-text">
            Don't have an account? <span className="modal-link" onClick={handleSwitch}>Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

