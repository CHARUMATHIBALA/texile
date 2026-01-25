import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, category = 'general' }) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const price = product.price || product.basePrice || 0;

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img 
          src={product.image || '/hero.png'} 
          alt={product.name}
          className="product-image"
        />
        <button 
          className={`wishlist-btn-card ${isInWishlist(product.id) ? 'active' : ''}`}
          onClick={toggleWishlist}
          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist(product.id) ? '❤️' : '🤍'}
        </button>
        {product.customizable && (
          <span className="customizable-badge-card">✨ Custom</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹ {price.toLocaleString('en-IN')}</p>
        <button 
          className="view-details-btn"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
