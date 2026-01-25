import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getRecentlyViewed } from '../utils/recentlyViewed';

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { wishlist, clearWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);

    // Load recently viewed
    const recent = getRecentlyViewed();
    setRecentlyViewed(recent);
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  if (!user) {
    return (
      <>
        <div className="profile-page">
          <div className="profile-empty">
            <h2>Please login to view your profile</h2>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          <h1 className="profile-title">My Profile</h1>

          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders ({orders.length})
            </button>
            <button
              className={`profile-tab ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              Wishlist ({wishlist.length})
            </button>
            <button
              className={`profile-tab ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recently Viewed
            </button>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-details">
                <div className="profile-section">
                  <h2>Personal Information</h2>
                  <div className="profile-info">
                    <div className="info-row">
                      <label>Name:</label>
                      <span>{user.name}</span>
                    </div>
                    <div className="info-row">
                      <label>Email:</label>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <button className="logout-btn-profile" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                  <div className="empty-orders">
                    <p>No orders yet</p>
                    <button onClick={() => navigate('/')}>Start Shopping</button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div>
                            <h3>Order #{order.id}</h3>
                            <p className="order-date">
                              {new Date(order.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status}`}>{order.status}</span>
                            <p className="order-total">₹ {order.total.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="order-items-list">
                          {order.items.map(item => (
                            <div key={item.id} className="order-item-card">
                              <img src={item.image || '/hero.png'} alt={item.name} />
                              <div>
                                <p>{item.name}</p>
                                <small>
                                  {item.customization?.size && `Size: ${item.customization.size} `}
                                  {item.customization?.color && `Color: ${item.customization.color} `}
                                  Qty: {item.quantity}
                                </small>
                              </div>
                              <p>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                        </div>
                        <div className="order-address">
                          <p><strong>Shipping to:</strong></p>
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="wishlist-section">
                <div className="wishlist-header">
                  <h2>My Wishlist</h2>
                  {wishlist.length > 0 && (
                    <button className="clear-wishlist-btn" onClick={clearWishlist}>
                      Clear Wishlist
                    </button>
                  )}
                </div>
                {wishlist.length === 0 ? (
                  <div className="empty-wishlist">
                    <p>Your wishlist is empty</p>
                    <button onClick={() => navigate('/')}>Browse Products</button>
                  </div>
                ) : (
                  <div className="products-grid">
                    {wishlist.map(product => (
                      <ProductCard key={product.id} product={product} category={product.category} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recent' && (
              <div className="recent-section">
                <h2>Recently Viewed</h2>
                {recentlyViewed.length === 0 ? (
                  <div className="empty-recent">
                    <p>No recently viewed products</p>
                    <button onClick={() => navigate('/')}>Browse Products</button>
                  </div>
                ) : (
                  <div className="products-grid">
                    {recentlyViewed.map(product => (
                      <ProductCard key={product.id} product={product} category={product.category} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
