import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import DesignYourBag from "./components/DesignYourBag";
import DesignYourCarpet from "./components/DesignYourCarpet";
import DesignYourBedsheet from "./components/DesignYourBedsheet";
import AboutUs from "./components/AboutUs";
import CustomizableCategories from "./pages/CustomizableCategories";
import "./style.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/design-bag" element={<DesignYourBag />} />
        <Route path="/design-carpet" element={<DesignYourCarpet />} />
        <Route path="/design-bedsheet" element={<DesignYourBedsheet />} />
        <Route path="/customizable-categories" element={<CustomizableCategories />} />
        <Route path="/about" element={<AboutUs />} />
        {/* Legacy routes for backward compatibility */}
        <Route path="/shop" element={<CategoryPage />} />
        <Route path="/bedsheets" element={<CategoryPage />} />
      </Routes>
    </>
  );
}

export default App;
