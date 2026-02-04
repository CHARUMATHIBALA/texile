import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const buyNowItem = location?.state?.buyNowItem;

  const effectiveItems = useMemo(() => {
    if (buyNowItem) return [buyNowItem];
    return cartItems;
  }, [buyNowItem, cartItems]);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = useMemo(() => {
    return effectiveItems.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0);
  }, [effectiveItems]);
  const tax = subtotal * 0.18;
  const shipping = subtotal >= 2000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const trackingPreviewSteps = ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // 1. Create Order in Backend
      const orderItems = effectiveItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        productId: item.productId,
        customization: item.customization || {},
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          country: 'India',
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const rawText = await response.text().catch(() => '');
        let message = '';
        try {
          const parsed = rawText ? JSON.parse(rawText) : null;
          message = parsed?.message || '';
        } catch {
          message = '';
        }
        throw new Error(message || rawText || `Failed to place order (HTTP ${response.status})`);
      }

      const createdOrder = await response.json();

      const isOnlinePayment = formData.paymentMethod !== 'cod';
      if (isOnlinePayment) {
        // 2. Load Razorpay SDK
        const res = await loadRazorpay();

        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }

        // 3. Create Razorpay Order (Server side)
        const paymentData = await fetch('/api/payment/create-order', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ amount: total }),
        }).then((t) => t.json());

        // Get Razorpay Key ID
        const razorpayKey = await fetch('/api/config/razorpay').then((t) => t.text());

        // 4. Open Razorpay
        const options = {
          key: razorpayKey,
          amount: paymentData.amount,
          currency: 'INR',
          name: 'Shri Ahalya Tex',
          description: 'Purchase of goods',
          order_id: paymentData.id,
          handler: async function (response) {
            // 5. Verify Payment
            const verifyRes = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id,
              }),
            });

            if (verifyRes.ok) {
              setOrderId(createdOrder._id);
              clearCart();
              setOrderPlaced(true);
              navigate(`/orders/${createdOrder._id}`);
            } else {
              alert('Payment verification failed');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        // COD Logic
        setOrderId(createdOrder._id);
        if (!buyNowItem) clearCart();
        setOrderPlaced(true);
        navigate(`/orders/${createdOrder._id}`);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(error?.message || 'Failed to place order. Please try again.');
    }
  };

  if (effectiveItems.length === 0 && !orderPlaced) {
    return (
      <>
        <div className="checkout-page">
          <EmptyState
            message="Your cart is empty"
            icon="🛒"
            actionLabel="Continue Shopping"
            onAction={() => navigate('/')}
          />
        </div>
        <Footer />
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <div className="checkout-page">
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase.</p>
            <p className="order-id">Order ID: {orderId}</p>
            <div className="success-details">
              <p><strong>Shipping to:</strong></p>
              <p>{formData.fullName}</p>
              <p>{formData.address}</p>
              <p>{formData.city}, {formData.state} - {formData.pincode}</p>
              <p><strong>Payment Method:</strong> {
                formData.paymentMethod === 'cod' ? 'Cash on Delivery' :
                formData.paymentMethod === 'card' ? 'Credit/Debit Card' :
                'UPI'
              }</p>
            </div>
            <button className="shop-now-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            <button className="view-orders-btn" onClick={() => navigate(`/orders/${orderId}`)}>
              View / Track Order
            </button>
            <button className="view-orders-btn" onClick={() => navigate('/my-orders')}>
              My Orders
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-stepper" aria-label="Checkout steps">
            <div className="checkout-step done">
              <div className="checkout-step-dot" />
              <div className="checkout-step-label">Cart</div>
            </div>
            <div className="checkout-step current">
              <div className="checkout-step-dot" />
              <div className="checkout-step-label">Address</div>
            </div>
            <div className="checkout-step">
              <div className="checkout-step-dot" />
              <div className="checkout-step-label">Payment</div>
            </div>
            <div className="checkout-step">
              <div className="checkout-step-dot" />
              <div className="checkout-step-label">Confirmation</div>
            </div>
          </div>
          <h1 className="checkout-title">Secure Checkout</h1>
          <div className="checkout-subtitle">Your payment is processed securely. We never store card details.</div>
          
          <div className="checkout-content">
            <div className="checkout-form-section">
              <h2>Shipping Address</h2>
              <form className="checkout-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 digit phone number"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6 digits"
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>

                <div className="payment-methods">
                  <h2>Payment Method</h2>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                      />
                      <span>UPI</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                      />
                      <span>Credit / Debit Card</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="netbanking"
                        checked={formData.paymentMethod === 'netbanking'}
                        onChange={handleChange}
                      />
                      <span>Net Banking</span>
                    </label>
                  </div>
                  <div className="payment-security-hint">
                    <strong>Security:</strong> Online payments use Razorpay secure checkout. For COD, pay only after delivery.
                  </div>
                </div>

                <div className="delivery-preview">
                  <h2>Delivery Tracking</h2>
                  <div className="tracking">
                    <div className="tracking-bar" aria-hidden="true">
                      <div className="tracking-bar-fill" style={{ width: '25%' }} />
                    </div>
                    <div className="tracking-steps">
                      {trackingPreviewSteps.map((step, idx) => (
                        <div key={step} className={`tracking-step ${idx === 0 ? 'current' : ''}`}>
                          <div className="tracking-dot" />
                          <div className="tracking-label">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tracking-meta" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                    <div className="tracking-meta-row">
                      <strong>Estimated delivery:</strong>{' '}
                      <span>3-5 business days</span>
                    </div>
                  </div>
                </div>

                <button type="button" className="place-order-btn" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              </form>
            </div>

            <div className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="order-items">
                {effectiveItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-info">
                      <img src={item.image || '/hero.png'} alt={item.name} />
                      <div>
                        <p className="order-item-name">{item.name}</p>
                        <small>
                          {item.customization?.size && `Size: ${item.customization.size} `}
                          {item.customization?.color && `Color: ${item.customization.color}`}
                        </small>
                        <small>Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <p className="order-item-price">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="total-row">
                  <span>Tax (18% GST):</span>
                  <span>₹ {tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>₹ {total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
