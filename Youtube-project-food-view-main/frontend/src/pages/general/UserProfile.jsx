
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../routes/AppRoutes';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false); // 🛒 CART MODAL STATE
    const navigate = useNavigate();
    
    // 🔗 PULL DATA DIRECTLY FROM GLOBAL STATE
    const { savedReels, cartItems, setCartItems, activeOrders, setActiveOrders } = useContext(AppContext);

    useEffect(() => {
        const userData = localStorage.getItem('activeUser');
        if (userData && userData !== "null" && userData !== "undefined") {
            try { setUser(JSON.parse(userData)); } 
            catch (e) { console.error("Failed to parse user session", e); }
        } else {
            navigate('/user/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('activeUser');
        toast.success('You have successfully logged out.');
        window.location.href = '/';
    };

    if (!user) return null;

    return (
        <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px 140px 20px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', maxWidth: '600px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 40px', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                
                {/* Customer Avatar */}
                <div style={{ position: 'relative' }}>
                    <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', border: '4px solid #1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
                        <span style={{ fontSize: '50px' }}>😋</span>
                    </div>
                    <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: '#10b981', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '2px solid #050505' }}>✓</span>
                </div>

                {/* Customer Details */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '0.5px', textTransform: 'capitalize' }}>
                        {user.fullName || user.name || "Foodie"}
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>{user.email}</p>
                    <span style={{ display: 'inline-block', margin: '10px auto 0 auto', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Premium Customer
                    </span>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', marginTop: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffb300' }}>{savedReels.length}</div>
                        <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Saved Dishes</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                        {/* ⚡ DIRECTLY REFLECTING ACTIVE ORDERS NUMBER */}
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981' }}>{activeOrders.length}</div>
                        <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Active Orders</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '10px' }}>
                    
                    {/* 🛒 VIEW CART BUTTON */}
                    <button 
                        onClick={() => setIsCartOpen(true)} 
                        style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} 
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'} 
                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                    >
                        🛒 View Cart {cartItems.length > 0 && <span style={{ background: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{cartItems.length}</span>}
                    </button>

                    <button 
                        onClick={handleLogout} 
                        style={{ width: '100%', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px' }} 
                        onMouseOver={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.2)' }} 
                        onMouseOut={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.1)' }}
                    >
                        Log Out
                    </button>
                </div>
            </section>

            {/* 🛒 CART OVERLAY MODAL */}
            {isCartOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '20px' }}>
                    <div style={{ background: '#1c1c1e', width: '100%', maxWidth: '500px', maxHeight: '70vh', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)', animation: 'modalSlideUp 0.3s ease-out forwards', boxShadow: '0 -10px 40px rgba(0,0,0,0.8)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>🛒 Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍽️</div>
                                    <p>Your cart is empty.</p>
                                    <p style={{ fontSize: '13px' }}>Go add some delicious reels!</p>
                                </div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ width: '60px', height: '60px', background: '#000', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                            <video src={item.video} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.name || item.title || "Special Dish"}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#888', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {item.description}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setCartItems(prev => prev.filter((_, i) => i !== index))}
                                            style={{ background: 'rgba(220, 38, 38, 0.15)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0 }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <button 
                                onClick={() => {
                                    // Move cart items directly to Active Orders!
                                    setActiveOrders(prev => [...prev, ...cartItems]);
                                    toast.success("Checkout complete! Items moved to active orders.");
                                    setCartItems([]);
                                    setIsCartOpen(false);
                                }}
                                style={{ width: '100%', padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', marginTop: '20px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }}
                            >
                                Proceed to Checkout
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </main>
    );
};

export default UserProfile;
