import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import Search from '../pages/general/Search';
import BottomNav from '../components/BottomNav';
import Profile from '../pages/food-partner/Profile';
import CreateFood from '../pages/food-partner/CreateFood';
import UserProfile from '../pages/general/UserProfile'; 

export const AppContext = createContext();

const PremiumAuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <div style={{ background: 'linear-gradient(135deg, #121214 0%, #0a0a0b 100%)', border: '1px solid rgba(234, 88, 12, 0.25)', width: '360px', padding: '35px 30px', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(234, 88, 12, 0.1)', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
                <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '0.5px' }}>Authentication Required</h2>
                <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: '0 0 25px 0' }}>You must be logged in as an authorized Food Partner to access the upload features.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => { onClose(); navigate('/food-partner/login'); }} style={{ width: '100%', padding: '14px', background: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Go to Login</button>
                    <button onClick={onClose} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const ProtectedRoute = ({ children }) => {
    const partnerData = localStorage.getItem('activePartner');
    const [showModal, setShowModal] = useState(false);
    let isValidPartner = false;
    if (partnerData && partnerData !== "null" && partnerData !== "undefined" && partnerData.trim() !== "") {
        try {
            const parsed = JSON.parse(partnerData);
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                if (parsed._id || parsed.id || parsed.email || parsed.name) isValidPartner = true;
            }
        } catch (error) { if (partnerData.length > 4) isValidPartner = true; }
    }
    useEffect(() => { if (!isValidPartner) setShowModal(true); }, [isValidPartner]);
    if (!isValidPartner) return ( <><PremiumAuthModal isOpen={showModal} onClose={() => setShowModal(false)} /><Navigate to="/" replace /></> );
    return children;
};

const AppRoutes = () => {
    
    // 🧠 BULLETPROOF MEMORY FOR ENGAGEMENT (LIKES, SAVES, COMMENTS)
    const [savedReels, setSavedReels] = useState(() => {
        const local = localStorage.getItem('userSavedReels');
        return local ? JSON.parse(local) : [];
    });
    
    const [likedReels, setLikedReels] = useState(() => {
        const local = localStorage.getItem('userLikedReels');
        return local ? JSON.parse(local) : {};
    });

    const [reelComments, setReelComments] = useState(() => {
        const local = localStorage.getItem('userReelComments');
        return local ? JSON.parse(local) : {};
    });
    
    // 🛒 BULLETPROOF MEMORY FOR CART AND ORDERS
    const [cartItems, setCartItems] = useState(() => {
        const localCart = localStorage.getItem('userCart');
        return localCart ? JSON.parse(localCart) : [];
    });

    const [activeOrders, setActiveOrders] = useState(() => {
        const localOrders = localStorage.getItem('userOrders');
        return localOrders ? JSON.parse(localOrders) : [];
    });

    // 💾 AUTO-SAVE EVERYTHING TO BROWSER STORAGE WHENEVER IT CHANGES
    useEffect(() => { localStorage.setItem('userSavedReels', JSON.stringify(savedReels)); }, [savedReels]);
    useEffect(() => { localStorage.setItem('userLikedReels', JSON.stringify(likedReels)); }, [likedReels]);
    useEffect(() => { localStorage.setItem('userReelComments', JSON.stringify(reelComments)); }, [reelComments]);
    useEffect(() => { localStorage.setItem('userCart', JSON.stringify(cartItems)); }, [cartItems]);
    useEffect(() => { localStorage.setItem('userOrders', JSON.stringify(activeOrders)); }, [activeOrders]);

    const logoutPartnerSession = () => {
        localStorage.removeItem('activePartner');
        localStorage.removeItem('activeUser'); 
        window.location.href = '/';
    };

    return (
        <AppContext.Provider value={{ 
            savedReels, setSavedReels, 
            likedReels, setLikedReels, 
            reelComments, setReelComments, 
            cartItems, setCartItems,          
            activeOrders, setActiveOrders,    
            logoutPartnerSession 
        }}>
            <Router>
                <Routes>
                    <Route path="/register" element={<ChooseRegister />} />
                    <Route path="/user/register" element={<UserRegister />} />
                    <Route path="/user/login" element={<UserLogin />} />
                    <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                    <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                    
                    <Route path="/" element={<><Home /><BottomNav /></>} />
                    <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                    <Route path="/search" element={<><Search /><BottomNav /></>} />
                    
                    <Route path="/create-food" element={<ProtectedRoute><CreateFood /><BottomNav /></ProtectedRoute>} />
                    <Route path="/food-partner/me" element={<ProtectedRoute><Profile /><BottomNav /></ProtectedRoute>} />
                    <Route path="/food-partner/:id" element={<><Profile /><BottomNav /></>} />
                    <Route path="/user/me" element={<><UserProfile /><BottomNav /></>} />
                </Routes>
            </Router>
        </AppContext.Provider>
    );
};

export default AppRoutes;