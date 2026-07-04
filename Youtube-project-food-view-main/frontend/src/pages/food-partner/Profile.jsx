// import React, { useState, useEffect, useContext } from 'react'
// import '../../styles/profile.css'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'
// import { AppContext } from '../../routes/AppRoutes'
// import { toast } from 'react-toastify'

// import chefImg from '../../assets/chef.jpg'

// const Profile = () => {
//     const { id } = useParams()
//     const [ profile, setProfile ] = useState(null)
//     const [ videos, setVideos ] = useState([])
//     const [ activeManageReelId, setActiveManageReelId ] = useState(null)
//     const [ sessionTrigger, setSessionTrigger ] = useState(Date.now())
    
//     // Live Database Analytics Sync State Framework
//     const [ analyticsData, setAnalyticsData ] = useState({ likes: 0, saves: 0, comments: 0 })
//     const [ showAnalyticsPanelId, setShowAnalyticsPanelId ] = useState(null)

//     // Consumption of Global Context Logout Action Provider
//     const { logoutPartnerSession } = useContext(AppContext);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             const savedPartner = localStorage.getItem('activePartner');
//             if (!savedPartner || savedPartner === "null" || savedPartner === "undefined" || savedPartner.trim() === "") {
//                 if (profile !== null) {
//                     clearInterval(interval);
//                     window.location.reload();
//                 }
//             }
//         }, 100);
//         return () => clearInterval(interval);
//     }, [profile]);    

//     useEffect(() => {
//         const handleStorageChange = () => {
//             setSessionTrigger(Date.now());
//         };
//         window.addEventListener('storage', handleStorageChange);
//         return () => window.removeEventListener('storage', handleStorageChange);
//     }, []);

//     useEffect(() => {
//         let targetId = id;
//         let localData = null;

//         const savedPartner = localStorage.getItem('activePartner');
        
//         if (!savedPartner || savedPartner === "null" || savedPartner === "undefined" || savedPartner.trim() === "") {
//             setProfile(null);
//             setVideos([]);
//             return; 
//         }

//         if (targetId === 'undefined' || targetId === 'null') {
//             setProfile(null);
//             setVideos([]);
//             return;
//         }

//         if (savedPartner) {
//             try {
//                 localData = JSON.parse(savedPartner);
//                 if (!targetId || targetId === 'me') {
//                     targetId = localData._id || localData.id;
//                     setProfile(localData);
//                 }
//             } catch (e) {
//                 setProfile(null);
//                 setVideos([]);
//                 return;
//             }
//         }
//         const fetchId = (targetId && targetId !== 'me' && targetId !== 'undefined' && targetId !== 'null') ? targetId : '';
//         if (!fetchId || fetchId.trim() === "") return;
        
//         if (fetchId) {
//             axios.get(`http://localhost:3000/api/food-partner/${fetchId}`, { withCredentials: true })
//                 .then(response => {
//                     const partnerData = response.data.foodPartner || response.data.partner || response.data;
//                     if (partnerData) {
//                         setProfile(partnerData);
//                         setVideos(partnerData.foodItems || response.data.videos || []);
//                     }
//                 })
//                 .catch(err => {
//                     axios.get('http://localhost:3000/api/food', { withCredentials: true })
//                         .then(res => {
//                             const allFoods = Array.isArray(res.data) ? res.data : (res.data.foodItems || res.data.foods || []);
//                             const filtered = allFoods.filter(item => {
//                                 const itemPartnerId = item.foodPartner?._id || item.foodPartner || '';
//                                 return itemPartnerId.toString() === fetchId.toString();
//                             });
//                             setVideos(filtered);
//                         }).catch(e => console.log(e));
//                 });
//         }
//     }, [ id, sessionTrigger ]);    

//     const handleDeleteReel = async () => {
//         if (!activeManageReelId) return;
        
//         const confirmDelete = window.confirm("Are you sure you want to permanently delete this reel?");
//         if (!confirmDelete) return;

//         try {
//             const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
//             const cleanId = typeof rawId === 'object' ? JSON.stringify(rawId) : String(rawId).trim();
            
//             const response = await axios.delete(`http://localhost:3000/api/food/${cleanId}`, { withCredentials: true });
            
//             if (response.status === 200 || response.data.success) {
//                 setVideos(prevVideos => prevVideos.filter(video => {
//                     const vId = video._id || video.id || video;
//                     const checkId = typeof vId === 'object' ? JSON.stringify(vId) : String(vId).trim();
//                     return checkId !== cleanId;
//                 }));
//                 toast.success("The selected reel has been deleted successfully.", { position: "top-center" });
//                 setActiveManageReelId(null);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Operation failed. Unable to delete the reel.", { position: "top-center" });
//         }
//     };

//     // 📌 PIN REEL TO PROFILE FUNCTION (BULLETPROOF VERSION)
//     const handlePinReel = async () => {
//         if (!activeManageReelId) return;
//         try {
//             // Safely extract the ID whether it was passed as an object or a string
//             const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
//             const cleanId = typeof rawId === 'object' ? rawId.toString() : String(rawId).trim();

//             const res = await axios.post('http://localhost:3000/api/food/pin', { foodId: cleanId }, { withCredentials: true });
            
//             if (res.data.success) {
//                 toast.success(res.data.isPinned ? "Reel pinned to top!" : "Reel unpinned.", { position: "top-center" });
//                 setVideos(prev => prev.map(v => (v._id === cleanId || v.id === cleanId) ? { ...v, isPinned: res.data.isPinned } : v));
//             }
//             setActiveManageReelId(null);
//         } catch (error) {
//             // 🚨 LOG THE EXACT ERROR FOR DEBUGGING
//             console.error("PIN REEL ERROR:", error.response || error);
            
//             // Show the actual backend error message on the screen
//             const errorMsg = error.response?.data?.message || error.message || "Unknown server error.";
//             toast.error(`Error: ${errorMsg}`, { position: "top-center" });
//         }
//     };

//     const handleViewAnalytics = async () => {
//         if (!activeManageReelId) return;
        
//         const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
//         const cleanId = String(rawId).trim();
        
//         const selectedReel = videos.find(video => {
//             const vId = video._id || video.id || video;
//             return String(vId).trim() === cleanId;
//         });

//         try {
//             const response = await axios.post(`http://localhost:3000/api/food/analytics`, { foodId: cleanId }, { withCredentials: true });
            
//             if (response.data.success) {
//                 const likes = response.data.likesCount !== undefined ? response.data.likesCount : 0;
//                 const saves = response.data.savesCount !== undefined ? response.data.savesCount : 0;
//                 const comments = selectedReel && Array.isArray(selectedReel.comments) ? selectedReel.comments.length : 0;
                
//                 setAnalyticsData({ likes, saves, comments });
//                 setShowAnalyticsPanelId(cleanId);
//             }
//         } catch (error) {
//             const likesFallback = selectedReel && selectedReel.likeCount !== undefined ? selectedReel.likeCount : 0;
//             const savesFallback = selectedReel && selectedReel.savesCount !== undefined ? selectedReel.savesCount : 0;
//             const commentsFallback = selectedReel && Array.isArray(selectedReel.comments) ? selectedReel.comments.length : 0;

//             setAnalyticsData({ likes: likesFallback, saves: savesFallback, comments: commentsFallback });
//             setShowAnalyticsPanelId(cleanId);
//         }
//         setActiveManageReelId(null); // Close the menu so the modal can show
//     };

//     const liveSessionData = localStorage.getItem('activePartner');
//     const isLoggedIn = !!(liveSessionData && liveSessionData !== "null" && liveSessionData !== "undefined" && liveSessionData.trim() !== "" && profile && id !== 'undefined' && id !== 'null');

//     // 🔄 SORT VIDEOS SO PINNED ITEMS SHOW UP FIRST
//     const sortedVideos = [...videos].sort((a, b) => (b.isPinned === true ? 1 : 0) - (a.isPinned === true ? 1 : 0));
//     const activeReelData = videos.find(v => (v._id || v.id) === activeManageReelId);

//     return (
//         <main className="profile-page" style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px 140px 20px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
//             {/* Expanded Ultra-Premium Glassmorphic Header Card with Enhanced Layout Scale */}
//             <section className="profile-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '60px', maxWidth: '920px', margin: '0 auto 40px auto', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 55px', borderRadius: '32px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(234, 88, 12, 0.04)' }}>
                
//                 {/* Modern Square Avatar Viewport */}
//                 <div style={{ flexShrink: 0, position: 'relative' }}>
//                     {isLoggedIn && profile ? (
//                         <img 
//                             className="profile-avatar" 
//                             src={chefImg} 
//                             alt="Authorized Food Partner Profile Avatar" 
//                             style={{ width: '200px', height: '200px', borderRadius: '26px', objectFit: 'cover', border: '3.5px solid #ea580c', boxShadow: '0 0 35px rgba(234, 88, 12, 0.5)' }}
//                         />
//                     ) : (
//                         <div 
//                             className="profile-avatar guest-avatar-box" 
//                             style={{ width: '200px', height: '200px', borderRadius: '26px', background: 'linear-gradient(135deg, #1f1f23 0%, #111113 100%)', border: '3.5px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                         >
//                             <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5">
//                                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                                 <circle cx="12" cy="7" r="4" />
//                             </svg>
//                         </div>
//                     )}
//                     <span style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: (isLoggedIn && profile) ? '#ea580c' : '#3f3f46', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '2px solid #050505', boxShadow: '0 3px 12px rgba(0,0,0,0.5)' }}>👨‍🍳</span>
//                 </div>

//                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
//                         <h1 className="profile-business" style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '0.5px' }}>
//                             {isLoggedIn && profile ? (profile?.name || "Guest Kitchen") : "Guest Kitchen"}
//                         </h1>
//                         {isLoggedIn && profile && (
//                             <span style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(234, 88, 12, 0.3)', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 0 10px rgba(234, 88, 12, 0.1)' }}>Verified Partner</span>
//                         )}
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
//                         <div style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(234, 88, 12, 0.05) 100%)', border: '1px solid rgba(234, 88, 12, 0.35)', padding: '10px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 4px 15px rgba(234, 88, 12, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
//                             <span style={{ fontSize: '9px', color: '#ea580c', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1.2px', marginBottom: '2px' }}>Executive Chef</span>
//                             <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                                 {isLoggedIn && profile ? (profile?.contactName || "Not Logged In") : "Not Logged In"} 🧑‍🍳
//                             </span>
//                         </div>

//                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '17px', color: '#ff4d4d', marginLeft: '45px', textTransform: 'capitalize', fontWeight: '600', letterSpacing: '0.3px', textShadow: '0 0 10px rgba(255, 77, 77, 0.15)' }}>
//                             <span style={{ fontSize: '19px' }}>📍</span>
//                             <span>{isLoggedIn && profile ? (profile?.address || "No Active Session Location") : "No Active Session Location"}</span>
//                         </div>
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', marginTop: '10px', width: '100%' }}>
//                         <div className="profile-stats" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', height: '52px', boxSizing: 'border-box', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
//                             <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.6px' }}>Culinary Reels</span>
//                             <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>{isLoggedIn && profile ? videos.length : 0}</span>
//                         </div>

//                         {isLoggedIn && profile && (
//                             <button
//                                 onClick={logoutPartnerSession}
//                                 onMouseEnter={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.15)'; e.target.style.transform = 'translateY(-1px)'; }}
//                                 onMouseLeave={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.05)'; e.target.style.transform = 'translateY(0)'; }}
//                                 style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.22)', borderRadius: '16px', padding: '0 26px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease', textTransform: 'uppercase', letterSpacing: '0.8px', height: '52px', boxSizing: 'border-box' }}
//                             >
//                                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
//                                 </svg>
//                                 Log Out
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </section>

//             {/* 🎞️ STRUCTURED GRID WITH PINNED AND OUT OF STOCK VISUAL BADGES */}
//             <section className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '920px', margin: '0 auto' }}>
//                 {isLoggedIn && profile && sortedVideos.map((v) => {
//                     const currentId = v._id || v.id;

//                     return (
//                         <div key={currentId} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                            
//                             {/* BADGES LAYER */}
//                             <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
//                                 {v.isPinned && (
//                                     <div style={{ background: '#ea580c', color: '#fff', fontSize: '11px', padding: '6px 10px', borderRadius: '8px', fontWeight: '800', boxShadow: '0 2px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                                         📌 Pinned
//                                     </div>
//                                 )}
//                             </div>

//                             <div style={{ width: '100%', aspectRatio: '9/16', borderRadius: '12px', overflow: 'hidden', background: '#090909', border: '1px solid rgba(255, 255, 255, 0.06)', position: 'relative' }}>
//                                 <video
//                                     style={{ objectFit: 'cover', width: '100%', height: '100%', filter: v.isOutOfStock ? 'grayscale(80%) brightness(0.5)' : 'none', transition: 'filter 0.3s' }}
//                                     src={v.video} 
//                                     muted 
//                                     controls={!v.isOutOfStock} 
//                                 />
                                
//                                 {/* 🚫 OUT OF STOCK VISUAL OVERLAY */}
//                                 {v.isOutOfStock && (
//                                     <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
//                                         <div style={{ background: 'rgba(255, 77, 77, 0.9)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '900', fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
//                                             Sold Out
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {(!id || id === 'me') && (
//                                 <button
//                                     onClick={() => {
//                                         setShowAnalyticsPanelId(null);
//                                         setActiveManageReelId(currentId);
//                                     }}
//                                     style={{ background: 'rgba(234, 88, 12, 0.08)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
//                                 >
//                                     ⚙️ Manage Reel
//                                 </button>
//                             )}
//                         </div>
//                     );
//                 })}
//             </section>

//             {/* Premium Instagram-Style Multi-Action Sheet Overlay Modal */}
//             {activeManageReelId && isLoggedIn && profile && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
//                     <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', width: '280px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column' }}>
                        
//                         <button onClick={handleViewAnalytics} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#00eeff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}>
//                             📊 View Analytics
//                         </button>

//                         <button onClick={handlePinReel} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#ffffff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'center' }}>
//                             {activeReelData?.isPinned ? "📍 Unpin from Profile" : "📌 Pin to Profile"}
//                         </button>

//                         <button onClick={handleDeleteReel} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#ff4d4d', fontSize: '14px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}>
//                             Delete Reel
//                         </button>

//                         <button
//                             onClick={async () => {
//                                 try {
//                                     const cleanId = String(activeManageReelId).trim();
//                                     const res = await axios.post('http://localhost:3000/api/food/out-of-stock', { foodId: cleanId }, { withCredentials: true });
//                                     if (res.data.success) {
//                                         toast.success("Stock status updated successfully!", { position: "top-center" });
//                                         setVideos(prev => prev.map(v => (v._id === cleanId || v.id === cleanId) ? { ...v, isOutOfStock: res.data.isOutOfStock } : v));
//                                     }
//                                     setActiveManageReelId(null);
//                                 } catch (error) {
//                                     toast.error("Operation failed. Unable to toggle stock settings.", { position: "top-center" });
//                                 }
//                             }}
//                             style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#eab308', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
//                         >
//                             {activeReelData?.isOutOfStock ? "✅ Mark as In Stock" : "🚫 Mark Out of Stock"}
//                         </button>
                        
//                         <button onClick={() => setActiveManageReelId(null)} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', color: '#8e8e93', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'center' }}>
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* 📊 NEW: ANALYTICS MODAL UI RENDERING */}
//             {showAnalyticsPanelId && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
//                     <div style={{ background: '#1c1c1e', width: '340px', padding: '35px 25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
//                         <div style={{ fontSize: '32px', marginBottom: '10px' }}>📈</div>
//                         <h3 style={{ margin: '0 0 30px 0', fontSize: '22px', color: '#fff', fontWeight: '700' }}>Reel Performance</h3>
                        
//                         <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '35px', padding: '20px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                 <span style={{ fontSize: '28px', fontWeight: '800', color: '#ff2d55' }}>{analyticsData.likes}</span>
//                                 <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Likes</span>
//                             </div>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                 <span style={{ fontSize: '28px', fontWeight: '800', color: '#ffb300' }}>{analyticsData.saves}</span>
//                                 <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Saves</span>
//                             </div>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                 <span style={{ fontSize: '28px', fontWeight: '800', color: '#00eeff' }}>{analyticsData.comments}</span>
//                                 <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Comments</span>
//                             </div>
//                         </div>

//                         <button 
//                             onClick={() => setShowAnalyticsPanelId(null)} 
//                             style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', transition: 'background 0.2s' }}
//                             onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
//                             onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
//                         >
//                             Close Analytics
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </main>
//     )
// }
// export default Profile;












// import React, { useState, useEffect, useContext } from 'react';
// import '../../styles/profile.css';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AppContext } from '../../routes/AppRoutes';
// import { toast } from 'react-toastify';
// import chefImg from '../../assets/chef.jpg';

// const Profile = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [profile, setProfile] = useState(null);
//     const [videos, setVideos] = useState([]);
    
//     // 🔐 NEW: Determine if the viewer is the OWNER of this kitchen
//     const [isOwner, setIsOwner] = useState(false);

//     const [activeManageReelId, setActiveManageReelId] = useState(null);
//     const [analyticsData, setAnalyticsData] = useState({ likes: 0, saves: 0, comments: 0 });
//     const [showAnalyticsPanelId, setShowAnalyticsPanelId] = useState(null);

//     const { logoutPartnerSession } = useContext(AppContext);

//     useEffect(() => {
//         let targetId = id;
//         const savedPartner = localStorage.getItem('activePartner');
//         let localPartnerData = null;

//         if (savedPartner && savedPartner !== "null" && savedPartner !== "undefined") {
//             try { localPartnerData = JSON.parse(savedPartner); } 
//             catch (e) { console.error("Failed to parse partner session"); }
//         }

//         // 1. Handle "My Profile" click from BottomNav
//         if (!targetId || targetId === 'me') {
//             if (localPartnerData) {
//                 targetId = localPartnerData._id || localPartnerData.id;
//                 setProfile(localPartnerData);
//                 setIsOwner(true);
//             } else {
//                 // Not a partner, shouldn't be here
//                 navigate('/');
//                 return;
//             }
//         }

//         // 2. Fetch the Storefront Profile Data from Backend
//         if (targetId && targetId !== 'me') {
//             axios.get(`http://localhost:3000/api/food-partner/${targetId}`, { withCredentials: true })
//                 .then(response => {
//                     const partnerData = response.data.foodPartner || response.data.partner || response.data;
//                     if (partnerData) {
//                         setProfile(partnerData);
//                         setVideos(partnerData.foodItems || response.data.videos || []);
                        
//                         // Check if the logged-in partner is looking at their own page
//                         if (localPartnerData && (localPartnerData._id === partnerData._id || localPartnerData.id === partnerData._id)) {
//                             setIsOwner(true);
//                         }
//                     }
//                 })
//                 .catch(err => {
//                     console.error("Failed to fetch profile", err);
//                 });
//         }
//     }, [id, navigate]);

//     const handleToggleStatus = async () => {
//         try {
//             const partnerId = profile._id || profile.id;
//             const res = await axios.put(`http://localhost:3000/api/food-partner/toggle-status/${partnerId}`, {}, { withCredentials: true });
//             if (res.data.success) {
//                 setProfile(prev => ({ ...prev, isAcceptingOrders: res.data.isAcceptingOrders }));
//                 toast.success(res.data.isAcceptingOrders ? "🟢 Kitchen is now OPEN!" : "🔴 Kitchen is now CLOSED!");
//             }
//         } catch (error) {
//             toast.error("Failed to update status.");
//         }
//     };

//     const handleDeleteReel = async () => {
//         if (!activeManageReelId) return;
//         const confirmDelete = window.confirm("Are you sure you want to permanently delete this reel?");
//         if (!confirmDelete) return;

//         try {
//             const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
//             const cleanId = typeof rawId === 'object' ? JSON.stringify(rawId) : String(rawId).trim();
//             const response = await axios.delete(`http://localhost:3000/api/food/${cleanId}`, { withCredentials: true });
            
//             if (response.status === 200 || response.data.success) {
//                 setVideos(prevVideos => prevVideos.filter(video => {
//                     const vId = video._id || video.id || video;
//                     const checkId = typeof vId === 'object' ? JSON.stringify(vId) : String(vId).trim();
//                     return checkId !== cleanId;
//                 }));
//                 toast.success("Reel deleted successfully.", { position: "top-center" });
//                 setActiveManageReelId(null);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Unable to delete reel.", { position: "top-center" });
//         }
//     };

//     const handlePinReel = async () => {
//         if (!activeManageReelId) return;
//         try {
//             const cleanId = String(activeManageReelId).trim();
//             const res = await axios.post('http://localhost:3000/api/food/pin', { foodId: cleanId }, { withCredentials: true });
//             if (res.data.success) {
//                 toast.success(res.data.isPinned ? "Reel pinned to top!" : "Reel unpinned.", { position: "top-center" });
//                 setVideos(prev => prev.map(v => (v._id === cleanId || v.id === cleanId) ? { ...v, isPinned: res.data.isPinned } : v));
//             }
//             setActiveManageReelId(null);
//         } catch (error) {
//             toast.error("Unable to toggle pin status.", { position: "top-center" });
//         }
//     };

//     const handleViewAnalytics = async () => {
//         if (!activeManageReelId) return;
//         const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
//         const cleanId = String(rawId).trim();
//         const selectedReel = videos.find(video => String(video._id || video.id).trim() === cleanId);

//         try {
//             const response = await axios.post(`http://localhost:3000/api/food/analytics`, { foodId: cleanId }, { withCredentials: true });
//             if (response.data.success) {
//                 setAnalyticsData({
//                     likes: response.data.likesCount || 0,
//                     saves: response.data.savesCount || 0,
//                     comments: selectedReel && Array.isArray(selectedReel.comments) ? selectedReel.comments.length : 0
//                 });
//                 setShowAnalyticsPanelId(cleanId);
//             }
//         } catch (error) {
//             setAnalyticsData({
//                 likes: selectedReel?.likeCount || 0,
//                 saves: selectedReel?.savesCount || 0,
//                 comments: selectedReel?.comments?.length || 0
//             });
//             setShowAnalyticsPanelId(cleanId);
//         }
//         setActiveManageReelId(null);
//     };

//     const sortedVideos = [...videos].sort((a, b) => (b.isPinned === true ? 1 : 0) - (a.isPinned === true ? 1 : 0));
//     const activeReelData = videos.find(v => (v._id || v.id) === activeManageReelId);

//     // Show a loading screen while fetching
//     if (!profile && id !== 'me') {
//         return (
//             <main style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <p style={{ color: '#aaa' }}>Loading Kitchen Profile...</p>
//             </main>
//         );
//     }

//     return (
//         <main className="profile-page" style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px 140px 20px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
//             <section className="profile-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '60px', maxWidth: '920px', margin: '0 auto 40px auto', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 55px', borderRadius: '32px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(234, 88, 12, 0.04)' }}>
                
//                 <div style={{ flexShrink: 0, position: 'relative' }}>
//                     <img 
//                         className="profile-avatar" 
//                         src={chefImg} 
//                         alt="Profile Avatar" 
//                         style={{ width: '200px', height: '200px', borderRadius: '26px', objectFit: 'cover', border: '3.5px solid #ea580c', boxShadow: '0 0 35px rgba(234, 88, 12, 0.5)' }}
//                     />
//                     <span style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#ea580c', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '2px solid #050505', boxShadow: '0 3px 12px rgba(0,0,0,0.5)' }}>👨‍🍳</span>
//                 </div>

//                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
//                         <h1 className="profile-business" style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '0.5px' }}>
//                             {/* 🏪 RENDER PUBLIC DATA */}
//                             {profile?.name || "Kitchen"}
//                         </h1>
//                         <span style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(234, 88, 12, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
//                             Verified Partner
//                         </span>
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
//                         <div style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(234, 88, 12, 0.05) 100%)', border: '1px solid rgba(234, 88, 12, 0.35)', padding: '10px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                             <span style={{ fontSize: '9px', color: '#ea580c', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1.2px', marginBottom: '2px' }}>Executive Chef</span>
//                             <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                                 {/* 🏪 RENDER PUBLIC DATA */}
//                                 {profile?.contactName || "Chef"} 🧑‍🍳
//                             </span>
//                         </div>

//                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '17px', color: '#ff4d4d', marginLeft: '45px', textTransform: 'capitalize', fontWeight: '600' }}>
//                             <span style={{ fontSize: '19px' }}>📍</span>
//                             {/* 🏪 RENDER PUBLIC DATA */}
//                             <span>{profile?.address || "Location Unavailable"}</span>
//                         </div>
//                     </div>

//                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', marginTop: '10px', width: '100%' }}>
//                         <div className="profile-stats" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', height: '52px' }}>
//                             <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.6px' }}>Culinary Reels</span>
//                             <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>{videos.length}</span>
//                         </div>

//                         {/* ⚙️ ONLY SHOW LOGOUT & TOGGLE IF OWNER */}
//                         {isOwner && (
//                             <div style={{ display: 'flex', gap: '10px' }}>
//                                 <button
//                                     onClick={handleToggleStatus}
//                                     style={{ background: profile?.isAcceptingOrders !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: profile?.isAcceptingOrders !== false ? '#10b981' : '#ef4444', border: `1px solid ${profile?.isAcceptingOrders !== false ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '16px', padding: '0 20px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', height: '52px', textTransform: 'uppercase' }}
//                                 >
//                                     {profile?.isAcceptingOrders !== false ? "🟢 Open for Orders" : "🔴 Closed"}
//                                 </button>
                                
//                                 <button
//                                     onClick={logoutPartnerSession}
//                                     style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.22)', borderRadius: '16px', padding: '0 20px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', height: '52px', textTransform: 'uppercase' }}
//                                 >
//                                     Log Out
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </section>

//             <section className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '920px', margin: '0 auto' }}>
//                 {/* 🎞️ RENDER VIDEOS UNCONDITIONALLY */}
//                 {sortedVideos.map((v) => {
//                     const currentId = v._id || v.id;

//                     return (
//                         <div key={currentId} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                            
//                             <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
//                                 {v.isPinned && (
//                                     <div style={{ background: '#ea580c', color: '#fff', fontSize: '11px', padding: '6px 10px', borderRadius: '8px', fontWeight: '800', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
//                                         📌 Pinned
//                                     </div>
//                                 )}
//                             </div>

//                             <div style={{ width: '100%', aspectRatio: '9/16', borderRadius: '12px', overflow: 'hidden', background: '#090909', position: 'relative' }}>
//                                 <video style={{ objectFit: 'cover', width: '100%', height: '100%', filter: v.isOutOfStock ? 'grayscale(80%) brightness(0.5)' : 'none' }} src={v.video} muted controls={!v.isOutOfStock} />
//                                 {v.isOutOfStock && (
//                                     <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
//                                         <div style={{ background: 'rgba(220, 38, 38, 0.95)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '900', fontSize: '15px', textTransform: 'uppercase' }}>Sold Out</div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* ⚙️ ONLY SHOW MANAGE REEL BUTTON IF OWNER */}
//                             {isOwner && (
//                                 <button
//                                     onClick={() => { setShowAnalyticsPanelId(null); setActiveManageReelId(currentId); }}
//                                     style={{ background: 'rgba(234, 88, 12, 0.08)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', textTransform: 'uppercase' }}
//                                 >
//                                     ⚙️ Manage Reel
//                                 </button>
//                             )}
//                         </div>
//                     );
//                 })}
//             </section>

//             {/* 🛠️ ONLY RENDER MANAGEMENT MODALS FOR THE OWNER */}
//             {activeManageReelId && isOwner && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
//                     <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', width: '280px', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
//                         <button onClick={handleViewAnalytics} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#00eeff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📊 View Analytics</button>
//                         <button onClick={handlePinReel} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#ffffff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>{activeReelData?.isPinned ? "📍 Unpin from Profile" : "📌 Pin to Profile"}</button>
//                         <button onClick={handleDeleteReel} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#ff4d4d', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Delete Reel</button>
//                         <button onClick={async () => {
//                                 try {
//                                     const cleanId = String(activeManageReelId).trim();
//                                     const res = await axios.post('http://localhost:3000/api/food/out-of-stock', { foodId: cleanId }, { withCredentials: true });
//                                     if (res.data.success) {
//                                         toast.success("Stock status updated!", { position: "top-center" });
//                                         setVideos(prev => prev.map(v => (v._id === cleanId || v.id === cleanId) ? { ...v, isOutOfStock: res.data.isOutOfStock } : v));
//                                     }
//                                     setActiveManageReelId(null);
//                                 } catch (error) { toast.error("Unable to toggle stock settings.", { position: "top-center" }); }
//                             }}
//                             style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#eab308', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
//                         >{activeReelData?.isOutOfStock ? "✅ Mark as In Stock" : "🚫 Mark Out of Stock"}</button>
//                         <button onClick={() => setActiveManageReelId(null)} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', color: '#8e8e93', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
//                     </div>
//                 </div>
//             )}

//             {/* 📊 ANALYTICS MODAL */}
//             {showAnalyticsPanelId && isOwner && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
//                     <div style={{ background: '#1c1c1e', width: '340px', padding: '35px 25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
//                         <div style={{ fontSize: '32px', marginBottom: '10px' }}>📈</div>
//                         <h3 style={{ margin: '0 0 30px 0', fontSize: '22px', color: '#fff', fontWeight: '700' }}>Reel Performance</h3>
//                         <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '35px', padding: '20px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                 <span style={{ fontSize: '28px', fontWeight: '800', color: '#ff2d55' }}>{analyticsData.likes}</span>
//                                 <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>Likes</span>
//                             </div>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                 <span style={{ fontSize: '28px', fontWeight: '800', color: '#ffb300' }}>{analyticsData.saves}</span>
//                                 <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>Saves</span>
//                             </div>
//                             <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//                                 <span style={{ fontSize: '28px', fontWeight: '800', color: '#00eeff' }}>{analyticsData.comments}</span>
//                                 <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>Comments</span>
//                             </div>
//                         </div>
//                         <button onClick={() => setShowAnalyticsPanelId(null)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>Close Analytics</button>
//                     </div>
//                 </div>
//             )}
//         </main>
//     )
// }
// export default Profile;













import React, { useState, useEffect, useContext } from 'react';
import '../../styles/profile.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../routes/AppRoutes';
import { toast } from 'react-toastify';
import { getInitials, getAvatarGradient } from '../../utils/avatar';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    
    // 🔐 NEW: Determine if the viewer is the OWNER of this kitchen
    const [isOwner, setIsOwner] = useState(false);

    const [activeManageReelId, setActiveManageReelId] = useState(null);
    const [analyticsData, setAnalyticsData] = useState({ likes: 0, saves: 0, comments: 0 });
    const [showAnalyticsPanelId, setShowAnalyticsPanelId] = useState(null);

    const { logoutPartnerSession } = useContext(AppContext);

    useEffect(() => {
        let targetId = id;
        const savedPartner = localStorage.getItem('activePartner');
        let localPartnerData = null;

        if (savedPartner && savedPartner !== "null" && savedPartner !== "undefined") {
            try { localPartnerData = JSON.parse(savedPartner); } 
            catch (e) { console.error("Failed to parse partner session"); }
        }

        // 1. Handle "My Profile" click from BottomNav
        if (!targetId || targetId === 'me') {
            if (localPartnerData) {
                targetId = localPartnerData._id || localPartnerData.id;
                setProfile(localPartnerData);
                setIsOwner(true);
            } else {
                // Not a partner, shouldn't be here
                navigate('/');
                return;
            }
        }

        // 2. Fetch the Storefront Profile Data from Backend
        if (targetId && targetId !== 'me') {
            axios.get(`http://localhost:3000/api/food-partner/${targetId}`, { withCredentials: true })
                .then(response => {
                    const partnerData = response.data.foodPartner || response.data.partner || response.data;
                    if (partnerData) {
                        setProfile(partnerData);
                        setVideos(partnerData.foodItems || response.data.videos || []);
                        
                        // Check if the logged-in partner is looking at their own page
                        if (localPartnerData && (localPartnerData._id === partnerData._id || localPartnerData.id === partnerData._id)) {
                            setIsOwner(true);
                        }
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch profile", err);
                });
        }
    }, [id, navigate]);

    const handleToggleStatus = async () => {
        try {
            const partnerId = profile._id || profile.id;
            const res = await axios.put(`http://localhost:3000/api/food-partner/toggle-status/${partnerId}`, {}, { withCredentials: true });
            if (res.data.success) {
                setProfile(prev => ({ ...prev, isAcceptingOrders: res.data.isAcceptingOrders }));
                toast.success(res.data.isAcceptingOrders ? "🟢 Kitchen is now OPEN!" : "🔴 Kitchen is now CLOSED!");
            }
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleDeleteReel = async () => {
        if (!activeManageReelId) return;
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this reel?");
        if (!confirmDelete) return;

        try {
            const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
            const cleanId = typeof rawId === 'object' ? JSON.stringify(rawId) : String(rawId).trim();
            const response = await axios.delete(`http://localhost:3000/api/food/${cleanId}`, { withCredentials: true });
            
            if (response.status === 200 || response.data.success) {
                setVideos(prevVideos => prevVideos.filter(video => {
                    const vId = video._id || video.id || video;
                    const checkId = typeof vId === 'object' ? JSON.stringify(vId) : String(vId).trim();
                    return checkId !== cleanId;
                }));
                toast.success("Reel deleted successfully.", { position: "top-center" });
                setActiveManageReelId(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to delete reel.", { position: "top-center" });
        }
    };

    const handlePinReel = async () => {
        if (!activeManageReelId) return;
        try {
            const cleanId = String(activeManageReelId).trim();
            const res = await axios.post('http://localhost:3000/api/food/pin', { foodId: cleanId }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.isPinned ? "Reel pinned to top!" : "Reel unpinned.", { position: "top-center" });
                setVideos(prev => prev.map(v => (v._id === cleanId || v.id === cleanId) ? { ...v, isPinned: res.data.isPinned } : v));
            }
            setActiveManageReelId(null);
        } catch (error) {
            toast.error("Unable to toggle pin status.", { position: "top-center" });
        }
    };

    const handleViewAnalytics = async () => {
        if (!activeManageReelId) return;
        const rawId = activeManageReelId._id || activeManageReelId.id || activeManageReelId;
        const cleanId = String(rawId).trim();
        const selectedReel = videos.find(video => String(video._id || video.id).trim() === cleanId);

        try {
            const response = await axios.post(`http://localhost:3000/api/food/analytics`, { foodId: cleanId }, { withCredentials: true });
            if (response.data.success) {
                setAnalyticsData({
                    likes: response.data.likesCount || 0,
                    saves: response.data.savesCount || 0,
                    comments: selectedReel && Array.isArray(selectedReel.comments) ? selectedReel.comments.length : 0
                });
                setShowAnalyticsPanelId(cleanId);
            }
        } catch (error) {
            setAnalyticsData({
                likes: selectedReel?.likeCount || 0,
                saves: selectedReel?.savesCount || 0,
                comments: selectedReel?.comments?.length || 0
            });
            setShowAnalyticsPanelId(cleanId);
        }
        setActiveManageReelId(null);
    };

    const sortedVideos = [...videos].sort((a, b) => (b.isPinned === true ? 1 : 0) - (a.isPinned === true ? 1 : 0));
    const activeReelData = videos.find(v => (v._id || v.id) === activeManageReelId);

    // Show a loading screen while fetching
    if (!profile && id !== 'me') {
        return (
            <main style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#aaa' }}>Loading Kitchen Profile...</p>
            </main>
        );
    }

    const kitchenName = profile?.name || "Kitchen";

    return (
        <main className="profile-page" style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px 140px 20px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <section className="profile-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '60px', maxWidth: '920px', margin: '0 auto 40px auto', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 55px', borderRadius: '32px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(234, 88, 12, 0.04)' }}>
                
                <div style={{ flexShrink: 0, position: 'relative' }}>
                    {/* 🔤 Initials-based DP — generated per kitchen, not a fixed image */}
                    <div
                        className="profile-avatar"
                        style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: getAvatarGradient(kitchenName),
                            border: '3.5px solid #ea580c',
                            boxShadow: '0 0 35px rgba(234, 88, 12, 0.5)',
                            fontSize: '64px',
                            fontWeight: '800',
                            color: '#ffffff',
                            letterSpacing: '1px',
                            textShadow: '0 4px 14px rgba(0,0,0,0.35)',
                            userSelect: 'none'
                        }}
                    >
                        {getInitials(kitchenName)}
                    </div>
                    <span style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#ea580c', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '2px solid #050505', boxShadow: '0 3px 12px rgba(0,0,0,0.5)' }}>👨‍🍳</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                        <h1 className="profile-business" style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#ffffff', letterSpacing: '0.5px' }}>
                            {/* 🏪 RENDER PUBLIC DATA */}
                            {kitchenName}
                        </h1>
                        <span style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(234, 88, 12, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Verified Partner
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(234, 88, 12, 0.05) 100%)', border: '1px solid rgba(234, 88, 12, 0.35)', padding: '10px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '9px', color: '#ea580c', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1.2px', marginBottom: '2px' }}>Executive Chef</span>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {/* 🏪 RENDER PUBLIC DATA */}
                                {profile?.contactName || "Chef"} 🧑‍🍳
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '17px', color: '#ff4d4d', marginLeft: '45px', textTransform: 'capitalize', fontWeight: '600' }}>
                            <span style={{ fontSize: '19px' }}>📍</span>
                            {/* 🏪 RENDER PUBLIC DATA */}
                            <span>{profile?.address || "Location Unavailable"}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px', marginTop: '10px', width: '100%' }}>
                        <div className="profile-stats" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', height: '52px' }}>
                            <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.6px' }}>Culinary Reels</span>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>{videos.length}</span>
                        </div>

                        {/* ⚙️ ONLY SHOW LOGOUT & TOGGLE IF OWNER */}
                        {isOwner && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleToggleStatus}
                                    style={{ background: profile?.isAcceptingOrders !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: profile?.isAcceptingOrders !== false ? '#10b981' : '#ef4444', border: `1px solid ${profile?.isAcceptingOrders !== false ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '16px', padding: '0 20px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', height: '52px', textTransform: 'uppercase' }}
                                >
                                    {profile?.isAcceptingOrders !== false ? "🟢 Open for Orders" : "🔴 Closed"}
                                </button>
                                
                                <button
                                    onClick={logoutPartnerSession}
                                    style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.22)', borderRadius: '16px', padding: '0 20px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', height: '52px', textTransform: 'uppercase' }}
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '920px', margin: '0 auto' }}>
                {/* 🎞️ RENDER VIDEOS UNCONDITIONALLY */}
                {sortedVideos.map((v) => {
                    const currentId = v._id || v.id;

                    return (
                        <div key={currentId} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                            
                            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
                                {v.isPinned && (
                                    <div style={{ background: '#ea580c', color: '#fff', fontSize: '11px', padding: '6px 10px', borderRadius: '8px', fontWeight: '800', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                        📌 Pinned
                                    </div>
                                )}
                            </div>

                            <div style={{ width: '100%', aspectRatio: '9/16', borderRadius: '12px', overflow: 'hidden', background: '#090909', position: 'relative' }}>
                                <video style={{ objectFit: 'cover', width: '100%', height: '100%', filter: v.isOutOfStock ? 'grayscale(80%) brightness(0.5)' : 'none' }} src={v.video} muted controls={!v.isOutOfStock} />
                                {v.isOutOfStock && (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                        <div style={{ background: 'rgba(220, 38, 38, 0.95)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '900', fontSize: '15px', textTransform: 'uppercase' }}>Sold Out</div>
                                    </div>
                                )}
                            </div>

                            {/* ⚙️ ONLY SHOW MANAGE REEL BUTTON IF OWNER */}
                            {isOwner && (
                                <button
                                    onClick={() => { setShowAnalyticsPanelId(null); setActiveManageReelId(currentId); }}
                                    style={{ background: 'rgba(234, 88, 12, 0.08)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', textTransform: 'uppercase' }}
                                >
                                    ⚙️ Manage Reel
                                </button>
                            )}
                        </div>
                    );
                })}
            </section>

            {/* 🛠️ ONLY RENDER MANAGEMENT MODALS FOR THE OWNER */}
            {activeManageReelId && isOwner && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', width: '280px', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <button onClick={handleViewAnalytics} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#00eeff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>📊 View Analytics</button>
                        <button onClick={handlePinReel} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#ffffff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>{activeReelData?.isPinned ? "📍 Unpin from Profile" : "📌 Pin to Profile"}</button>
                        <button onClick={handleDeleteReel} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#ff4d4d', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Delete Reel</button>
                        <button onClick={async () => {
                                try {
                                    const cleanId = String(activeManageReelId).trim();
                                    const res = await axios.post('http://localhost:3000/api/food/out-of-stock', { foodId: cleanId }, { withCredentials: true });
                                    if (res.data.success) {
                                        toast.success("Stock status updated!", { position: "top-center" });
                                        setVideos(prev => prev.map(v => (v._id === cleanId || v.id === cleanId) ? { ...v, isOutOfStock: res.data.isOutOfStock } : v));
                                    }
                                    setActiveManageReelId(null);
                                } catch (error) { toast.error("Unable to toggle stock settings.", { position: "top-center" }); }
                            }}
                            style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#eab308', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                        >{activeReelData?.isOutOfStock ? "✅ Mark as In Stock" : "🚫 Mark Out of Stock"}</button>
                        <button onClick={() => setActiveManageReelId(null)} style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', color: '#8e8e93', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* 📊 ANALYTICS MODAL */}
            {showAnalyticsPanelId && isOwner && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                    <div style={{ background: '#1c1c1e', width: '340px', padding: '35px 25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📈</div>
                        <h3 style={{ margin: '0 0 30px 0', fontSize: '22px', color: '#fff', fontWeight: '700' }}>Reel Performance</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '35px', padding: '20px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#ff2d55' }}>{analyticsData.likes}</span>
                                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>Likes</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#ffb300' }}>{analyticsData.saves}</span>
                                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>Saves</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#00eeff' }}>{analyticsData.comments}</span>
                                <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600' }}>Comments</span>
                            </div>
                        </div>
                        <button onClick={() => setShowAnalyticsPanelId(null)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>Close Analytics</button>
                    </div>
                </div>
            )}
        </main>
    )
}
export default Profile;
