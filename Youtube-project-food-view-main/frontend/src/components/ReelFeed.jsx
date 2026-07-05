import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../routes/AppRoutes';
import { toast } from 'react-toastify';

// Naya prop "isGridMode" add kiya hai default false ke sath
const ReelFeed = ({ items: initialItems = [], emptyMessage = 'No videos yet.', isSavedPage = false, isGridMode = false }) => {
  const videoRefs = useRef(new Map());

  const { savedReels, setSavedReels, likedReels, setLikedReels, reelComments, setReelComments, setCartItems, setActiveOrders } = useContext(AppContext);

  const [items, setItems] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIcon, setActiveIcon] = useState({ id: null, type: '' });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [activeManageReelId, setActiveManageReelId] = useState(null);
  const [activeCommentReelId, setActiveCommentReelId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeNutritionReelId, setActiveNutritionReelId] = useState(null);

  const [expandedGridItem, setExpandedGridItem] = useState(null);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const filterCategories = ['All', 'Spicy', 'Sweet', 'Healthy', 'Snacks', 'Drinks'];
  
  const isFoodPartnerView = (() => {
    const partnerData = localStorage.getItem('activePartner');
    if (!partnerData || partnerData === "null" || partnerData === "undefined" || partnerData.trim() === "") return false;
    try {
      const parsed = JSON.parse(partnerData);
      return !!(parsed && typeof parsed === 'object' && (parsed._id || parsed.id || parsed.email || parsed.name));
    } catch (error) {
      return partnerData.length > 4;
    }
  })();

  useEffect(() => {
    const sourceData = isSavedPage ? savedReels : initialItems;
    setItems(prevItems => {
        const sameSet = prevItems.length === sourceData.length &&
            prevItems.every(v => sourceData.some(s => (s._id || s.id) === (v._id || v.id)));
        if (sameSet) return prevItems;
        return sourceData;
    });
  }, [initialItems, savedReels, isSavedPage]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) video.play().catch(() => {});
          else video.pause();
        });
      }, { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );

    Array.from(videoRefs.current.values()).forEach((vid) => {
        if (vid) observer.observe(vid);
    });

    return () => observer.disconnect();
  }, [items, expandedGridItem]);

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return; }
    videoRefs.current.set(id, el);
  };

  const handleVideoClick = (itemId) => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    setActiveIcon({ id: itemId, type: nextMuteState ? 'muted' : 'unmuted' });
    setTimeout(() => { setActiveIcon({ id: null, type: '' }); }, 800);
  };
  const handleLikeClick = async (item) => {
    const reelId = item._id;
    const isCurrentlyLiked = !!likedReels[reelId];

    setLikedReels(prev => ({ ...prev, [reelId]: !isCurrentlyLiked }));
    setItems(prevItems => prevItems.map(v =>
        (v._id === reelId || v.id === reelId)
        ? { ...v, likeCount: isCurrentlyLiked ? Math.max(0, (v.likeCount || 0) - 1) : (v.likeCount || 0) + 1 }
        : v
    ));

    try { await axios.post(`https://onrender.com`, { foodId: reelId }, { withCredentials: true }); }
    catch (err) { console.error("Like action failed:", err); }
  };

  const handleSaveClick = async (item) => {
    const reelId = item._id;
    const isAlreadySaved = savedReels.some(r => r._id === reelId);

    if (isAlreadySaved) {
        setSavedReels(prev => prev.filter(r => r._id !== reelId));
    } else {
        setSavedReels(prev => [...prev, item]);
    }

    setItems(prevItems => prevItems.map(v => {
        if (v._id === reelId || v.id === reelId) {
            const currentCount = v.savesCount || 0;
            return {
                ...v,
                savesCount: isAlreadySaved ? Math.max(0, currentCount - 1) : currentCount + 1
            };
        }
        return v;
    }));

    try {
        await axios.post(`https://onrender.com`, { foodId: reelId }, { withCredentials: true });
    } catch (err) {
        console.error("Save action failed:", err);
    }
  };

  const handleCommentClick = (reelId) => {
    if (activeCommentReelId === reelId) setActiveCommentReelId(null);
    else { setActiveCommentReelId(reelId); setNewCommentText(''); }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentReelId) return;
    const commentText = newCommentText.trim();
    const reelId = activeCommentReelId;
    const newCommentObj = { _id: Math.random().toString(), text: commentText };

    setReelComments(prev => ({ ...prev, [reelId]: [...(prev[reelId] || []), newCommentObj] }));
    setNewCommentText('');

    try { await axios.post(`https://onrender.com{reelId}/comment`, { text: commentText }); }
    catch (err) { console.error(err); }
  };

  const cleanText = (text) => { if (!text) return ''; return text.replace(/\*\*/g, ''); };

  const getNutritionInfo = (item) => {
    if (item.nutrition) return item.nutrition;
    const seed = (item._id || '').toString().split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return {
      calories: 200 + (seed % 300),
      protein: 5 + (seed % 20),
      carbs: 10 + (seed % 40),
      fats: 5 + (seed % 15),
    };
  };

  const handleExtractRecipe = async (item) => {
    const currentDishName = item.title || item.name || item.description || "Special Dish";
    const cleanDishName = currentDishName.replace(/[^\w\s]/gi, '').trim();
    const lowerName = cleanDishName.toLowerCase();
    try {
      setSelectedRecipe({ title: `✨ Chef AI: ${cleanDishName}`, description: "Connecting directly to Gemini AI Server...", ingredients: ["Fetching authentic real-time data..."], steps: ["Please wait..."] });
      const response = await axios.post('https://onrender.com', { dishName: currentDishName });
      if (response.data) setSelectedRecipe(response.data);
    } catch (err) {
      const isSweet = lowerName.includes('waffle') || lowerName.includes('cake') || lowerName.includes('sweet');
      if (isSweet) {
        setSelectedRecipe({ title: `✨ Chef AI: Premium ${cleanDishName}`, description: `A master chef guide to preparing perfectly textured, delicious ${cleanDishName}.`, ingredients: ["2 cups All-purpose flour", "1/2 cup Unsalted butter", "3/4 cup Sugar", "1 cup Milk", "Vanilla extract"], steps: ["Sift dry ingredients.", "Whisk wet ingredients.", "Fold together.", "Cook evenly until golden brown.", "Serve hot."] });
      } else {
        setSelectedRecipe({ title: `✨ Chef AI: Authentic ${cleanDishName}`, description: `A professional gourmet preparation guide for traditional, flavorful ${cleanDishName}.`, ingredients: [`500g Fresh core elements required for ${cleanDishName}`, "2 Onions & 3 Tomatoes", "Ginger-garlic paste", "Cumin seeds & Bay leaf", "Spices & Oil"], steps: ["Clean and prep elements.", "Heat oil and splutter spices.", "Sauté onions and paste.", "Add tomatoes and spices.", "Simmer for 15 mins.", "Serve hot."] });
      }
    }
  };

  const handleDeleteReel = async () => {
    if (!activeManageReelId) return;
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this reel?");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`https://onrender.com{activeManageReelId}`, { withCredentials: true });
      if (response.status === 200 || response.data.success) {
        setItems(prevVideos => prevVideos.filter(video => (video._id || video.id) !== activeManageReelId));
        toast.success("Reel deleted successfully.");
        setActiveManageReelId(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete the reel.");
    }
  };

  const handleAddToCart = (item) => {
    setCartItems(prevCart => [...prevCart, item]);
    toast.success(`🛒 ${item.name || item.title || "Dish"} added to your cart!`, { position: 'top-center' });
  };

  const handleOrderNow = (item) => {
    setActiveOrders(prevOrders => [...prevOrders, item]);
    toast.success(`⚡ Direct Order Placed for ${item.name || item.title || "Dish"}! Check active orders.`, { position: 'top-center' });
  };
  if (isGridMode && !expandedGridItem) {
    return (
      <div className="grid-scroll" style={{ width: '100%', height: 'calc(100vh - 65px)', backgroundColor: '#000', overflowY: 'auto' }}>
        <style>{`
          .grid-scroll::-webkit-scrollbar { display: none; }
          .grid-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          .grid-wrap { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; width: 100%; max-width: 600px; margin: 0 auto; padding-bottom: 20px; }
          @media (min-width: 700px) { .grid-wrap { max-width: 900px; grid-template-columns: repeat(4, 1fr); gap: 3px; } }
          .grid-thumb { width: 100%; aspect-ratio: 1 / 1; position: relative; cursor: pointer; background: #111; overflow: hidden; opacity: 0; animation: gridFadeIn 0.35s ease forwards; }
          @keyframes gridFadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
          .grid-thumb-video { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; display: block; }
          .grid-thumb:hover .grid-thumb-video { transform: scale(1.06); }
          .grid-reel-icon { position: absolute; top: 8px; right: 8px; z-index: 2; pointer-events: none; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.85)); }
          .grid-soldout-badge { position: absolute; top: 8px; left: 8px; z-index: 2; background: rgba(220,38,38,0.92); color: #fff; font-size: 9px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 7px; border-radius: 5px; }
          .grid-thumb-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 20px; background: rgba(0,0,0,0.32); opacity: 0; transition: opacity 0.2s ease; }
          .grid-thumb:hover .grid-thumb-overlay { opacity: 1; }
          .grid-stat { display: flex; align-items: center; gap: 5px; color: #fff; font-size: 14px; font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.6); }
          @media (hover: none) { .grid-thumb-overlay { display: none; } }
          @media (prefers-reduced-motion: reduce) { .grid-thumb { animation: none; opacity: 1; } .grid-thumb-video, .grid-thumb-overlay { transition: none; } }
        `}</style>
        <div className="grid-wrap">
          {items.length === 0 && <div style={{ color: '#fff', padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>{emptyMessage}</div>}
          {items.map((item, idx) => {
            const totalLikes = item.likeCount || item.likes || 0;
            const totalComments = (item.commentsCount || 0) + (reelComments[item._id] || []).length;

            return (
              <div
                key={item._id}
                onClick={() => setExpandedGridItem(item)}
                className="grid-thumb"
                style={{ animationDelay: `${Math.min(idx * 25, 300)}ms` }}
              >
                <video src={item.video} className="grid-thumb-video" muted loop playsInline preload="metadata" onMouseEnter={(e) => e.target.play().catch(() => {})} onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }} />
                <svg className="grid-reel-icon" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                {item.isOutOfStock && <span className="grid-soldout-badge">Sold Out</span>}
                <div className="grid-thumb-overlay">
                  <div className="grid-stat"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>{totalLikes}</div>
                  <div className="grid-stat"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>{totalComments}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const expandedItemId = expandedGridItem && (expandedGridItem._id || expandedGridItem.id);
  const liveExpandedItem = expandedItemId ? items.find(v => (v._id || v.id) === expandedItemId) : null;
  const displayItems = (expandedGridItem ? [expandedGridItem] : items).filter(item => {
      if (activeFilter === 'All') return true;
      const textToSearch = `${item.title || ''} ${item.description || ''} ${item.category || ''}`.toLowerCase();
      return textToSearch.includes(activeFilter.toLowerCase());
  });
  return (
    <div className="reels-page" style={{ width: '100%', height: 'calc(100vh - 65px)', display: 'flex', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>

      {expandedGridItem && (
        <button
          onClick={() => setExpandedGridItem(null)}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 9999, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fff', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
        >
          ←
        </button>
      )}
      <style>{`
        .reels-page { background: radial-gradient(120% 100% at 50% 0%, #1c1006 0%, #0a0705 45%, #000 78%); }
        .reels-feed::-webkit-scrollbar { display: none; }
        .reels-feed { -ms-overflow-style: none; scrollbar-width: none; max-width: 600px; }
        @media (min-width: 900px) { .reels-feed { max-width: 1100px; } .reel-card { max-width: 460px; height: 88vh; max-height: 840px; border-radius: 28px; box-shadow: 0 40px 100px -24px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07); } }
        .reel-card { position: relative; width: 100%; height: 100%; overflow: hidden; background: #000; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .reel-byline { font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: rgba(255,255,255,0.55); margin: 0 0 6px 0; }
        .reel-title { color: #fff; font-size: 21px; margin: 0; font-weight: 800; letter-spacing: -0.3px; text-shadow: 0 2px 6px rgba(0,0,0,0.6); }
        .reel-desc { color: rgba(255,255,255,0.85); font-size: 14px; margin: 0 0 16px 0; line-height: 1.45; text-shadow: 0 1px 4px rgba(0,0,0,0.6); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cta-row { display: flex; gap: 10px; }
        .cta-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; height: 44px; border-radius: 14px; font-size: 13px; font-weight: 700; white-space: nowrap; text-decoration: none; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease; }
        .cta-btn:hover { transform: translateY(-2px) scale(1.02); }
        .cta-btn:active { transform: translateY(0) scale(0.97); }
        .cta-recipe { background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; box-shadow: 0 6px 18px rgba(245,158,11,0.35); border: none; }
        .cta-store { background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; box-shadow: 0 6px 18px rgba(59,130,246,0.35); border: none; }
        .cta-cart { background: rgba(255,255,255,0.08); color: #fff; backdrop-filter: blur(10px); border-color: rgba(255,255,255,0.22); }
        .cta-order { height: 50px; font-size: 14px; font-weight: 800; background: linear-gradient(135deg, #10b981, #059669); color: #fff; box-shadow: 0 10px 26px rgba(16,185,129,0.4); border: none; }
        .reel-actions { position: absolute; right: 16px; bottom: 112px; display: flex; flex-direction: column; gap: 18px; align-items: center; pointer-events: auto; z-index: 999; }
        .reel-action-group { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .action-btn { width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s ease, border-color 0.2s ease; }
        .action-btn:hover { transform: scale(1.08); background: rgba(0,0,0,0.5); }
        .action-btn.is-liked { color: #ff2d55; background: rgba(255,45,85,0.18); border-color: rgba(255,45,85,0.4); transform: scale(1.05); }
        .action-btn.is-saved { color: #ffb300; background: rgba(255,179,0,0.18); border-color: rgba(255,179,0,0.4); transform: scale(1.05); }
        .action-count { color: #fff; font-size: 12px; font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.6); }
        .price-tag { display: inline-flex; align-items: center; background: rgba(16,185,129,0.16); color: #34d399; border: 1px solid rgba(16,185,129,0.4); font-size: 13px; font-weight: 800; padding: 3px 10px; border-radius: 10px; white-space: nowrap; line-height: 1.4; }
        .nutrition-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 19px; line-height: 1; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s ease, border-color 0.2s ease; }
        .nutrition-icon-btn:hover { transform: scale(1.08); background: rgba(0,0,0,0.55); }
        .nutrition-icon-btn.is-open { background: rgba(255,179,0,0.22); border-color: rgba(255,179,0,0.5); }
        .nutrition-popup { width: 158px; background: rgba(20,20,22,0.92); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 12px 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.5); animation: nutritionPop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .nutrition-popup-title { color: #ffb300; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
        .nutrition-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 12px; color: #fff; padding: 4px 0; }
        .nutrition-row span { color: rgba(255,255,255,0.75); }
        @keyframes nutritionPop { from { opacity: 0; transform: translateY(-6px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .comment-sheet { animation: sheetUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .recipe-modal-backdrop { animation: fadeIn 0.25s ease; }
        .recipe-modal-card { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.94) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .cta-btn, .action-btn, .comment-sheet, .recipe-modal-backdrop, .recipe-modal-card, .nutrition-icon-btn, .nutrition-popup { transition: none !important; animation: none !important; } }
      `}</style>
      <div className="reels-feed" role="list" style={{ width: '100%', height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {displayItems.length === 0 && ( <div className="empty-state" style={{ color: '#fff', marginTop: '50px' }}><p>{emptyMessage}</p></div> )}

        {displayItems.map((item) => {
          const isLikedByMe = !!likedReels[item._id];
          const isSavedByMe = savedReels.some(r => r._id === item._id);
          const totalLikes = item.likeCount || item.likes || 0;
          const totalSaves = item.savesCount || 0;
          const totalComments = (item.commentsCount || 0) + (reelComments[item._id] || []).length;
          const isCommentOpen = activeCommentReelId === item._id;
          const isOutOfStock = item.isOutOfStock;
          const partnerName = item.foodPartner && item.foodPartner.name;
          const isKitchenClosed = item.foodPartner && item.foodPartner.isAcceptingOrders === false;
          const displayName = item.title || item.name || "Special Dish";

          return (
            <section key={item._id} className="reel" role="listitem" style={{ position: 'relative', flex: '0 0 100%', width: '100%', height: '100%', scrollSnapAlign: 'start', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="reel-card">

                <video ref={setVideoRef(item._id)} className="reel-video" src={item.video} muted={isMuted} playsInline loop preload="metadata" onClick={() => handleVideoClick(item._id)} style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', filter: isOutOfStock ? 'grayscale(85%) brightness(0.4)' : 'none', transition: 'filter 0.3s ease' }} />

                <div className="reel-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>

                  {isOutOfStock && (
                    <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
                        <div style={{ background: 'rgba(220, 38, 38, 0.95)', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: '900', fontSize: '24px', letterSpacing: '3px', textTransform: 'uppercase', boxShadow: '0 8px 30px rgba(220, 38, 38, 0.5)', border: '2px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(4px)', textAlign: 'center' }}>Sold Out</div>
                    </div>
                  )}

                  {activeIcon.id === item._id && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.65)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', animation: 'fadeInOut 0.8s ease-in-out forwards', zIndex: 999 }}>
                      {activeIcon.type === 'muted' ? ( <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" y1="9" x2="16" y2="15"></line><line x1="16" y1="9" x2="22" y2="15"></line></svg>
                      ) : ( <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> )}
                    </div>
                  )}

                  <div className="reel-overlay-gradient" aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.88), transparent)' }} />

                  <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', pointerEvents: 'auto' }}>
                    <button
                      onClick={() => setActiveNutritionReelId(prev => (prev === item._id ? null : item._id))}
                      className={`nutrition-icon-btn${activeNutritionReelId === item._id ? ' is-open' : ''}`}
                      type="button"
                      aria-label="View nutrition info"
                    >🔥</button>

                    {activeNutritionReelId === item._id && (() => {
                      const n = getNutritionInfo(item);
                      return (
                        <div className="nutrition-popup">
                          <div className="nutrition-popup-title">Nutrition</div>
                          <div className="nutrition-row"><span>🔥 Calories</span><b>{n.calories} kcal</b></div>
                          <div className="nutrition-row"><span>🥩 Protein</span><b>{n.protein}g</b></div>
                          <div className="nutrition-row"><span>🍞 Carbs</span><b>{n.carbs}g</b></div>
                          <div className="nutrition-row"><span>🥑 Fats</span><b>{n.fats}g</b></div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="reel-actions">
                    <div className="reel-action-group"><button onClick={() => handleLikeClick(item)} className={`action-btn${isLikedByMe ? ' is-liked' : ''}`} type="button"><svg width="21" height="21" viewBox="0 0 24 24" fill={isLikedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg></button><div className="action-count">{totalLikes}</div></div>
                    <div className="reel-action-group"><button onClick={() => handleCommentClick(item._id)} className="action-btn" type="button"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg></button><div className="action-count">{totalComments}</div></div>
                    <div className="reel-action-group"><button onClick={() => handleSaveClick(item)} className={`action-btn${isSavedByMe ? ' is-saved' : ''}`} type="button"><svg width="21" height="21" viewBox="0 0 24 24" fill={isSavedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" /></svg></button><div className="action-count">{totalSaves}</div></div>
                  </div>

                  <div className="reel-content" style={{ position: 'absolute', bottom: '24px', left: '16px', right: '76px', display: 'flex', flexDirection: 'column', pointerEvents: 'auto', zIndex: 999 }}>

                    {partnerName && <div className="reel-byline">{partnerName}</div>}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h2 className="reel-title" style={{ margin: 0 }}>{displayName}</h2>
                      
                      <span style={{ 
                        background: 'rgba(16, 185, 129, 0.15)', 
                        border: '1px solid rgba(16, 185, 129, 0.4)', 
                        color: '#34d399', 
                        padding: '4px 10px', 
                        borderRadius: '10px', 
                        fontSize: '14px', 
                        fontWeight: '800', 
                        backdropFilter: 'blur(4px)',
                        letterSpacing: '0.5px'
                      }}>
                        ₹{item.price}
                      </span>
                    </div>

                    {(item.description || item.title) && <p className="reel-desc">{item.description || item.title}</p>}
                    <div className="cta-row" style={{ marginBottom: '10px' }}>
                      <button onClick={() => handleExtractRecipe(item)} className="cta-btn cta-recipe" type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2" /><path d="M5 11v11" /><path d="M19 2c-1.7 0-3 2-3 5v3a2 2 0 0 0 2 2h1v10" /></svg> View Recipe </button>
                      {item.foodPartner && ( <Link to={"/food-partner/" + (item.foodPartner._id || item.foodPartner)} className="cta-btn cta-store"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5" /><path d="M5 9v10h14V9" /><path d="M9 19v-6h6v6" /></svg> Visit Store </Link> )}
                    </div>

                    {!isOutOfStock && !isFoodPartnerView && (
                      <div className="cta-row">
                        <button onClick={() => handleAddToCart(item)} className="cta-btn cta-cart" type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> Add to Cart </button>
                        <button 
                          onClick={() => !isKitchenClosed && handleOrderNow(item)} 
                          disabled={isKitchenClosed}
                          className="cta-btn cta-order" 
                          style={{ 
                            background: isKitchenClosed ? '#4b5563' : 'linear-gradient(135deg, #10b981, #059669)', 
                            color: isKitchenClosed ? '#9ca3af' : '#fff',
                            boxShadow: isKitchenClosed ? 'none' : '0 10px 26px rgba(16,185,129,0.4)',
                            cursor: isKitchenClosed ? 'not-allowed' : 'pointer'
                          }} 
                          type="button"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
                          {isKitchenClosed ? 'Closed Right Now' : 'Order Now'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isCommentOpen && (
                  <div className="comment-sheet" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, rgba(28, 28, 30, 0.95) 0%, rgba(18, 18, 18, 1) 100%)', backdropFilter: 'blur(20px)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', maxHeight: '60vh', zIndex: 1000, boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px 0' }}><div style={{ width: '36px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }} /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}><h3 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: '700' }}>Comments</h3><button onClick={() => setActiveCommentReelId(null)} style={{ background: 'none', border: 'none', color: '#a3a3a3', fontSize: '24px', cursor: 'pointer', padding: '0 5px' }}>&times;</button></div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(reelComments[item._id] || []).length === 0 ? (
                        <div style={{ color: '#8e8e93', textAlign: 'center', fontSize: '13px', padding: '40px 0' }}>No comments yet. Start the conversation!</div>
                      ) : (
                        (reelComments[item._id] || []).map((c) => (
                          <div key={c._id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2c2c2e', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}><span style={{ fontSize: '14px' }}>👨‍🍳</span></div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', color: '#a3a3a3', fontWeight: '700', marginBottom: '4px' }}>GUEST CHEF</div><p style={{ margin: 0, color: '#e5e5ea', fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' }}>{c.text}</p></div></div>
                        ))
                      )}
                    </div>
                    <form onSubmit={handleSubmitComment} style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}><input type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add a comment..." style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '10px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }} /><button type="submit" disabled={!newCommentText.trim()} style={{ background: 'none', border: 'none', color: newCommentText.trim() ? '#00eeff' : 'rgba(0,238,255,0.3)', fontSize: '15px', fontWeight: '700', cursor: newCommentText.trim() ? 'pointer' : 'default' }}>Post</button></form>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {selectedRecipe && (
        <div className="recipe-modal-backdrop" onClick={() => setSelectedRecipe(null)} style={{ zIndex: 10000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }}>
          <div className="recipe-modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#1c1c1e', width: '90%', maxWidth: '500px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}><h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{cleanText(selectedRecipe.title)}</h3><button onClick={() => setSelectedRecipe(null)} style={{ fontSize: '28px', background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}>&times;</button></div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}><p style={{ color: '#e5e5ea', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0' }}>{cleanText(selectedRecipe.description)}</p><h4 style={{ color: '#ffb300', margin: '0 0 12px 0', fontSize: '16px' }}>Ingredients:</h4><ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>{selectedRecipe.ingredients ? selectedRecipe.ingredients.map((ing, idx) => <li key={idx} style={{ marginBottom: '6px' }}>{cleanText(ing)}</li>) : <li>No data</li>}</ul><h4 style={{ color: '#00eeff', margin: '0 0 12px 0', fontSize: '16px' }}>Steps:</h4><ol style={{ paddingLeft: '24px' }}>{selectedRecipe.steps ? selectedRecipe.steps.map((step, idx) => <li key={idx} style={{ marginBottom: '10px' }}>{cleanText(step)}</li>) : <li>No data</li>}</ol></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReelFeed;
