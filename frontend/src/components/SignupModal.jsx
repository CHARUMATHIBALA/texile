export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  const handleSwitch = (e) => {
    e.preventDefault();
    onClose();
    if (onSwitchToLogin) {
      setTimeout(() => onSwitchToLogin(), 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI only - no backend
    alert('Signup functionality - UI only');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Sign Up</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter your full name"
              required
            />
          </div>
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
              placeholder="Create a password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password"
              required
            />
          </div>
          <button type="submit" className="modal-submit-btn">Sign Up</button>
          <p className="modal-footer-text">
            Already have an account? <span className="modal-link" onClick={handleSwitch}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

