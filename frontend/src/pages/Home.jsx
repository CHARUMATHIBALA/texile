import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Delivery from '../components/Delivery';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../data/products';

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <Hero />
      <Categories />
      
      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} category={product.category} />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/shop" className="view-all-btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="offers-section">
        <div className="container">
          <h2 className="section-title">Special Offers</h2>
          <div className="offers-grid">
            <div className="offer-card">
              <div className="offer-icon">🎁</div>
              <h3>Free Shipping</h3>
              <p>On orders above ₹2000</p>
            </div>
            <div className="offer-card">
              <div className="offer-icon">💰</div>
              <h3>10% Off</h3>
              <p>Use code WELCOME10 on first order</p>
            </div>
            <div className="offer-card">
              <div className="offer-icon">🎨</div>
              <h3>Custom Designs</h3>
              <p>Get 15% off on customizable products</p>
            </div>
            <div className="offer-card">
              <div className="offer-icon">⭐</div>
              <h3>Loyalty Rewards</h3>
              <p>Earn points on every purchase</p>
            </div>
          </div>
        </div>
      </section>

      <Delivery />
      <Footer />
    </>
  );
}
