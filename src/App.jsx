import React, { useState, useEffect } from 'react';

const productsData = [
  { id: 1, name: 'Professional DSLR Camera', price: 750, category: 'Electronics', rating: 4.8, description: 'High-resolution professional camera with 4K video recording and interchangeable lenses.', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Minimalist Wristwatch', price: 120, category: 'Accessories', rating: 4.5, description: 'Elegant and sleek minimalist design featuring a genuine leather strap and water-resistant build.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Wireless Bluetooth Headphones', price: 200, category: 'Electronics', rating: 4.7, description: 'Active noise-canceling headphones with rich studio sound quality and 30-hour battery life.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Ergonomic Running Shoes', price: 90, category: 'Footwear', rating: 4.6, description: 'Lightweight breathable mesh athletic shoes engineered for maximum comfort and support during runs.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
];

export default function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('devstore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('devstore_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState({ items: [], total: 0 });

  useEffect(() => {
    localStorage.setItem('devstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('devstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCart = (product) => {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`"${product.name}" added to cart!`);
  };

  const removeFromCart = (indexToRemove) => {
    const removedItem = cart[indexToRemove];
    setCart(cart.filter((_, index) => index !== indexToRemove));
    showToast(`"${removedItem.name}" removed from cart.`);
  };

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      showToast(`Removed from Wishlist`);
    } else {
      setWishlist([...wishlist, product]);
      showToast(`Added to Wishlist ❤️`);
    }
  };

  const handleCheckout = () => {
    setLastOrderDetails({ items: [...cart], total: totalPrice });
    setOrderPlaced(true);
    setCart([]);
  };

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const themeStyles = {
    backgroundColor: darkMode ? '#121212' : '#f9f9f9',
    color: darkMode ? '#ffffff' : '#333333',
    minHeight: '100vh',
    padding: '20px',
    transition: 'all 0.3s ease',
    position: 'relative'
  };

  return (
    <div style={themeStyles}>
      {toastMessage && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#28a745', color: '#fff', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000, fontWeight: 'bold' }}>
          ✨ {toastMessage}
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: darkMode ? '2px solid #333' : '2px solid #eaeaea', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🛍️ DevStore - Enterprise Edition</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ backgroundColor: darkMode ? '#f0f0f0' : '#333', color: darkMode ? '#333' : '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <div style={{ backgroundColor: darkMode ? '#2a2a2a' : '#fff', padding: '8px 15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: darkMode ? '1px solid #444' : 'none' }}>
            ❤️ <strong>Wishlist:</strong> {wishlist.length} | 🛒 <strong>Cart:</strong> {totalItemsCount}
          </div>
        </div>
      </header>

      {orderPlaced ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderRadius: '12px', maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#28a745', fontSize: '28px' }}>🎉 Order Placed Successfully!</h2>
          <p style={{ color: darkMode ? '#aaa' : '#666' }}>Thank you for your purchase. Here is your order summary:</p>
          <div style={{ textAlign: 'left', margin: '20px 0', padding: '15px', backgroundColor: darkMode ? '#2a2a2a' : '#f1f1f1', borderRadius: '8px' }}>
            {lastOrderDetails.items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{it.name} (x{it.quantity})</span>
                <strong>${it.price * it.quantity}</strong>
              </div>
            ))}
            <hr style={{ borderColor: darkMode ? '#444' : '#ccc' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#28a745' }}>${lastOrderDetails.total}</span>
            </div>
          </div>
          <button
            onClick={() => setOrderPlaced(false)}
            style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '300px', padding: '10px 15px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: darkMode ? '#2a2a2a' : '#fff', color: darkMode ? '#fff' : '#000' }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: darkMode ? '#2a2a2a' : '#fff', color: darkMode ? '#fff' : '#000', cursor: 'pointer' }}
            >
              <option value="default">Sort by: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {['All', 'Electronics', 'Accessories', 'Footwear'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: selectedCategory === cat ? '#0070f3' : (darkMode ? '#2a2a2a' : '#e0e0e0'),
                  color: selectedCategory === cat ? '#fff' : (darkMode ? '#fff' : '#333')
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '300px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredProducts.map(product => {
                const isWishlisted = wishlist.some(item => item.id === product.id);
                return (
                  <div key={product.id} style={{ backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', color: darkMode ? '#ffffff' : '#333333', borderRadius: '8px', padding: '15px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    <button
                      onClick={() => toggleWishlist(product)}
                      style={{ position: 'absolute', top: '22px', right: '22px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                    >
                      {isWishlisted ? '❤️' : '🤍'}
                    </button>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => setSelectedProduct(product)} />
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: darkMode ? '#aaa' : '#666', textTransform: 'uppercase' }}>{product.category}</span>
                        <span style={{ fontSize: '12px', color: '#ffc107', fontWeight: 'bold' }}>⭐ {product.rating}</span>
                      </div>
                      <h3 style={{ fontSize: '16px', margin: '5px 0', cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>{product.name}</h3>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0070f3' }}>${product.price}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        style={{ flex: 1, backgroundColor: 'transparent', color: darkMode ? '#fff' : '#333', border: '1px solid #ccc', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        style={{ flex: 1, backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ flex: 1, minWidth: '280px', backgroundColor: darkMode ? '#1e1e1e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content' }}>
              <h2 style={{ fontSize: '20px', borderBottom: darkMode ? '1px solid #333' : '1px solid #eaeaea', paddingBottom: '10px', marginTop: 0 }}>Shopping Cart</h2>
              {cart.length === 0 ? (
                <p style={{ color: darkMode ? '#aaa' : '#777' }}>Your cart is empty.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cart.map((item, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: darkMode ? '1px solid #333' : '1px solid #f0f0f0', paddingBottom: '8px' }}>
                      <div>
                        <span>{item.name}</span>
                        <br />
                        <small style={{ color: darkMode ? '#aaa' : '#666' }}>${item.price} × {item.quantity}</small>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong>${item.price * item.quantity}</strong>
                        <button
                          onClick={() => removeFromCart(index)}
                          style={{ backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {cart.length > 0 && (
                <div style={{ marginTop: '20px', borderTop: darkMode ? '2px solid #333' : '2px solid #eaeaea', paddingTop: '15px' }}>
                  <h3>Total Amount: ${totalPrice}</h3>
                  <button
                    onClick={handleCheckout}
                    style={{ width: '100%', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: darkMode ? '#1e1e1e' : '#fff', color: darkMode ? '#fff' : '#333', padding: '25px', borderRadius: '10px', width: '400px', maxWidth: '90%', position: 'relative', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: darkMode ? '#aaa' : '#666', textTransform: 'uppercase' }}>{selectedProduct.category}</span>
              <span style={{ fontSize: '12px', color: '#ffc107', fontWeight: 'bold' }}>⭐ {selectedProduct.rating}</span>
            </div>
            <h2 style={{ margin: '5px 0' }}>{selectedProduct.name}</h2>
            <p style={{ fontSize: '14px', color: darkMode ? '#ccc' : '#555', lineHeight: '1.5' }}>{selectedProduct.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#0070f3' }}>${selectedProduct.price}</span>
              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                style={{ backgroundColor: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}