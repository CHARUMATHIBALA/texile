import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const handleRemove = (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(itemId);
    }
  };

  const applyCoupon = () => {
    const coupons = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'FREESHIP': 0, // Free shipping handled separately
      'CUSTOM15': 15
    };

    const discountPercent = coupons[couponCode.toUpperCase()];
    if (discountPercent !== undefined) {
      setDiscount(discountPercent);
      setCouponApplied(true);
      alert(`Coupon applied! ${discountPercent > 0 ? `${discountPercent}% discount` : 'Free shipping'} applied.`);
    } else {
      alert('Invalid coupon code');
    }
  };

  const subtotal = getTotalPrice();
  const discountAmount = (subtotal * discount) / 100;
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal >= 2000 ? 0 : 100;
  const total = subtotal - discountAmount + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <div className="cart-page">
          <div className="cart-empty">
            <EmptyState
              message="Your Cart is Empty"
              icon="🛒"
              actionLabel="Continue Shopping"
              onAction={() => navigate('/')}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image || '/hero.png'} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <div className="cart-item-specs">
                      {item.customization?.size && <span>Size: {item.customization.size}</span>}
                      {item.customization?.color && <span>Color: {item.customization.color}</span>}
                      {item.customization?.material && <span>Material: {item.customization.material}</span>}
                      {item.customization?.pattern && <span>Pattern: {item.customization.pattern}</span>}
                      {item.customization?.threadCount && <span>Thread Count: {item.customization.threadCount}</span>}
                      {item.customization?.customText && <span>Custom Text: {item.customization.customText}</span>}
                    </div>
                    <p className="cart-item-price">₹ {item.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="cart-item-quantity">
                    <label>Qty:</label>
                    <div className="quantity-selector">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <p>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>

                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemove(item.id)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              {/* Coupon Code Section */}
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                  disabled={couponApplied}
                />
                <button 
                  className="apply-coupon-btn"
                  onClick={applyCoupon}
                  disabled={couponApplied || !couponCode.trim()}
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount ({discount}%):</span>
                  <span>-₹ {discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Tax (18% GST):</span>
                <span>₹ {tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>₹ {total.toLocaleString('en-IN')}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <div className="cart-continue-wrap">
                <Link to="/" className="continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
