// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import ReelFeed from '../../components/ReelFeed';

// const Search = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredReels, setFilteredReels] = useState([]);
//   const [hasSearched, setHasSearched] = useState(false);
//   const scrollContainerRef = useRef(null);

//   const handleSearchSubmit = async (e) => {
//     e.preventDefault();
//     const query = searchQuery.trim();
    
//     if (!query) {
//       setFilteredReels([]);
//       setHasSearched(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:3000/api/reels/search/live?q=${query}`, { withCredentials: true });
      
//       if (Array.isArray(response.data)) {
//         const validReels = response.data.map(reel => ({
//           _id: reel._id,
//           title: reel.name || "Special Dish", 
//           description: reel.description || "",
//           video: reel.video, 
//           likes: reel.likeCount || 0, 
//           saves: reel.savesCount || 0, 
//           commentsCount: reel.commentsCount || 0,
//           foodPartner: reel.foodPartner
//         }));
        
//         setFilteredReels(validReels);
//       } else {
//         setFilteredReels([]);
//       }
//       setHasSearched(true);
//     } catch (err) {
//       console.error("Live database search call failed:", err);
//       setFilteredReels([]);
//       setHasSearched(true);
//     }
//   };

//   // Function to reset search and bring back the search panel (Cross button action)
//   const handleClearSearch = () => {
//     setFilteredReels([]);
//     setHasSearched(false);
//     setSearchQuery('');
//   };

//   useEffect(() => {
//     const handleMouseWheel = (e) => {
//       if (!hasSearched || filteredReels.length === 0 || !scrollContainerRef.current) return;
//       e.preventDefault();
//       scrollContainerRef.current.scrollTop += e.deltaY;
//     };

//     const targetDiv = scrollContainerRef.current;
//     if (targetDiv) {
//       targetDiv.addEventListener('wheel', handleMouseWheel, { passive: false });
//     }

//     return () => {
//       if (targetDiv) {
//         targetDiv.removeEventListener('wheel', handleMouseWheel);
//       }
//     };
//   }, [hasSearched, filteredReels]);

//   return (
//     <div className="search-page-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#000', color: '#fff', boxSizing: 'border-box', overflow: 'hidden' }}>
      
//       {/* 🎯 CONDITION 1: Show Big Search Panel ONLY when user hasn't searched yet */}
//       {!hasSearched && (
//         <div style={{ maxWidth: '500px', margin: '15vh auto 20px auto', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
//           <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px', color: '#fff', textAlign: 'center' }}>
//             ✨ What's on your mind?
//           </h3>
//           <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#aaa', textAlign: 'center' }}>
//             What do you want to eat today?
//           </p>

//           <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
//             <input 
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search macaroni, rajma..."
//               style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#121212', color: '#fff', outline: 'none', fontSize: '14px' }}
//             />
//             <button type="submit" style={{ background: '#ff9f43', color: '#fff', border: 'none', padding: '0 22px', borderRadius: '24px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
//               Search
//             </button>
//           </form>
//         </div>
//       )}

//       {/* 🎯 CONDITION 2: When searched, show floating Premium Cross Button at top-right over full screen */}
//       {hasSearched && (
//         <button 
//           onClick={handleClearSearch}
//           style={{ 
//             position: 'fixed', top: '25px', right: '25px', zIndex: 99999,
//             background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', color: '#fff',
//             border: '1px solid rgba(255, 255, 255, 0.2)', width: '45px', height: '45px',
//             borderRadius: '50%', fontSize: '20px', fontWeight: '600', cursor: 'pointer',
//             display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
//           }}
//           title="Clear Search"
//         >
//           ✕
//         </button>
//       )}

//       {/* 🎯 CONDITION 3: Dynamic Result Area - takes 100% full height if search panel is hidden */}
//       {hasSearched && (
//         <div 
//           ref={scrollContainerRef}
//           style={{ 
//             width: '100%',
//             height: '100vh', 
//             overflowY: 'scroll', 
//             scrollSnapType: 'y mandatory',
//             position: 'relative'
//           }}
//         >
//           {filteredReels.length > 0 ? (
//             <ReelFeed items={filteredReels} />
//           ) : (
//             <div style={{ textAlign: 'center', marginTop: '35vh', padding: '20px' }}>
//               <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍳</div>
//               <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#ff4d4d', fontWeight: '600' }}>
//                 Sorry, Dish Not Found!
//               </h4>
//               <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
//                 Our professional chefs are currently working on this preparation or it is out of stock.
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//     </div>
//   );
// };

// export default Search;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ReelFeed from '../../components/ReelFeed';

// const Search = () => {
//     const [query, setQuery] = useState('');
//     const [allFoods, setAllFoods] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // Fetch all foods when the search page loads
//     useEffect(() => {
//         const fetchAllFoods = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/food', { withCredentials: true });
//                 // Safely extract the array regardless of how the backend wraps it
//                 const foodsArray = Array.isArray(response.data) ? response.data : (response.data.foodItems || response.data.foods || []);
//                 setAllFoods(foodsArray);
//             } catch (error) {
//                 console.error("Error fetching foods for search:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchAllFoods();
//     }, []);

//     // 🔍 DUAL-SEARCH LOGIC: Filters by Dish Name OR Kitchen Name
//     const filteredFoods = allFoods.filter(item => {
//         const q = query.toLowerCase().trim();
        
//         // If the search bar is empty, show all videos (like an explore page)
//         if (!q) return true; 

//         // 1. Check if the Dish Name or Description matches
//         const dishMatch = (item.name || item.title || '').toLowerCase().includes(q) || 
//                           (item.description || '').toLowerCase().includes(q);
        
//         // 2. Check if the Kitchen (Food Partner) Name matches
//         let kitchenName = '';
//         if (item.foodPartner && typeof item.foodPartner === 'object') {
//             kitchenName = (item.foodPartner.name || '').toLowerCase();
//         }
//         const kitchenMatch = kitchenName.includes(q);

//         // Return true if EITHER the dish matches OR the kitchen matches
//         return dishMatch || kitchenMatch;
//     });

//     return (
//         <main className="search-page" style={{ minHeight: '100vh', background: '#050505', paddingTop: '20px', paddingBottom: '100px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
//             {/* 🔎 Premium Sticky Search Bar Viewport */}
//             <div style={{ position: 'sticky', top: '20px', zIndex: 100, padding: '0 20px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
//                 <div style={{ position: 'relative', width: '100%' }}>
                    
//                     {/* Search Icon */}
//                     <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#888', display: 'flex', alignItems: 'center' }}>
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                         </svg>
//                     </div>

//                     <input 
//                         type="text" 
//                         placeholder="Search for a dish or kitchen..." 
//                         value={query} 
//                         onChange={(e) => setQuery(e.target.value)}
//                         autoComplete="off"
//                         style={{ 
//                             width: '100%', 
//                             padding: '16px 16px 16px 50px', 
//                             borderRadius: '20px', 
//                             border: '1px solid rgba(255,255,255,0.15)', 
//                             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
//                             backdropFilter: 'blur(16px)', 
//                             WebkitBackdropFilter: 'blur(16px)', 
//                             color: '#fff', 
//                             fontSize: '16px',
//                             fontWeight: '500',
//                             outline: 'none',
//                             boxSizing: 'border-box',
//                             boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
//                             transition: 'border 0.3s ease'
//                         }}
//                         onFocus={(e) => e.target.style.border = '1px solid #ea580c'}
//                         onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.15)'}
//                     />

//                     {/* Clear Button */}
//                     {query && (
//                         <button 
//                             onClick={() => setQuery('')}
//                             style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', background: '#333', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
//                         >
//                             &times;
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* 🎞️ Results Area */}
//             {isLoading ? (
//                 <div style={{ textAlign: 'center', marginTop: '60px', color: '#888', fontWeight: '600' }}>
//                     <div style={{ fontSize: '30px', animation: 'spin 1s linear infinite', marginBottom: '10px' }}>⏳</div>
//                     Loading Explore Feed...
//                     <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//                 </div>
//             ) : filteredFoods.length > 0 ? (
//                 <ReelFeed items={filteredFoods} emptyMessage="No reels found." />
//             ) : (
//                 <div style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
//                     <div style={{ fontSize: '40px', marginBottom: '10px' }}>🕵️‍♂️</div>
//                     <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>No results found</h3>
//                     <p style={{ margin: 0, fontSize: '14px' }}>We couldn't find any dishes or kitchens matching "{query}".</p>
//                 </div>
//             )}
            
//         </main>
//     );
// };

// export default Search;

















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ReelFeed from '../../components/ReelFeed';

// const Search = () => {
//     const [query, setQuery] = useState('');
//     const [allFoods, setAllFoods] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchAllFoods = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/food', { withCredentials: true });
//                 const foodsArray = Array.isArray(response.data) ? response.data : (response.data.foodItems || response.data.foods || []);
                
//                 // 🕵️‍♂️ DIAGNOSTIC TOOL: Check your browser console (F12) to see this!
//                 console.log("👀 BACKEND DATA RECEIVED:", foodsArray);
                
//                 setAllFoods(foodsArray);
//             } catch (error) {
//                 console.error("Error fetching foods for search:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchAllFoods();
//     }, []);

//     // 🧠 SMART TEXT NORMALIZER (Ignores apostrophes, spaces, and cases)
//     const normalizeText = (text) => {
//         if (!text) return '';
//         // This turns "Dimple's Kitchen" into "dimpleskitchen" for flawless matching
//         return text.toLowerCase().replace(/[^a-z0-9]/g, ''); 
//     };

//     const filteredFoods = allFoods.filter(item => {
//         const q = normalizeText(query);
        
//         if (!q) return true; 

//         const dishMatch = normalizeText(item.name || item.title).includes(q) || 
//                           normalizeText(item.description).includes(q);
        
//         let kitchenName = '';
//         // Check if the backend actually sent the partner object with a name
//         if (item.foodPartner && item.foodPartner.name) {
//             kitchenName = normalizeText(item.foodPartner.name);
//         } else if (item.foodPartnerName) {
//             kitchenName = normalizeText(item.foodPartnerName);
//         }

//         const kitchenMatch = kitchenName.includes(q);

//         return dishMatch || kitchenMatch;
//     });

//     return (
//         <main className="search-page" style={{ minHeight: '100vh', background: '#050505', paddingTop: '20px', paddingBottom: '100px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
//             <div style={{ position: 'sticky', top: '20px', zIndex: 100, padding: '0 20px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
//                 <div style={{ position: 'relative', width: '100%' }}>
//                     <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#888', display: 'flex', alignItems: 'center' }}>
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                         </svg>
//                     </div>

//                     <input 
//                         type="text" 
//                         placeholder="Search for a dish or kitchen..." 
//                         value={query} 
//                         onChange={(e) => setQuery(e.target.value)}
//                         autoComplete="off"
//                         style={{ 
//                             width: '100%', padding: '16px 16px 16px 50px', borderRadius: '20px', 
//                             border: '1px solid rgba(255,255,255,0.15)', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', 
//                             backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', color: '#fff', fontSize: '16px', fontWeight: '500', outline: 'none', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'border 0.3s ease'
//                         }}
//                         onFocus={(e) => e.target.style.border = '1px solid #ea580c'}
//                         onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.15)'}
//                     />

//                     {query && (
//                         <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', background: '#333', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>&times;</button>
//                     )}
//                 </div>
//             </div>

//             {isLoading ? (
//                 <div style={{ textAlign: 'center', marginTop: '60px', color: '#888', fontWeight: '600' }}>
//                     <div style={{ fontSize: '30px', animation: 'spin 1s linear infinite', marginBottom: '10px' }}>⏳</div>
//                     Loading Explore Feed...
//                     <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//                 </div>
//             ) : filteredFoods.length > 0 ? (
//                 <ReelFeed items={filteredFoods} emptyMessage="No reels found." />
//             ) : (
//                 <div style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
//                     <div style={{ fontSize: '40px', marginBottom: '10px' }}>🕵️‍♂️</div>
//                     <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>No results found</h3>
//                     <p style={{ margin: 0, fontSize: '14px' }}>We couldn't find any dishes or kitchens matching "{query}".</p>
//                 </div>
//             )}
//         </main>
//     );
// };

// export default Search;






// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import ReelFeed from '../../components/ReelFeed';

// const ACCENT = '#ea580c';

// const Search = () => {
//     const [query, setQuery] = useState('');
//     const [allFoods, setAllFoods] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const inputRef = useRef(null);

//     useEffect(() => {
//         const fetchAllFoods = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/food', { withCredentials: true });
//                 const foodsArray = Array.isArray(response.data) ? response.data : (response.data.foodItems || response.data.foods || []);
//                 setAllFoods(foodsArray);
//             } catch (error) {
//                 console.error("Error fetching foods for search:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchAllFoods();
//     }, []);

//     // Normalizes text so "Dimple's Kitchen" and "dimples kitchen" match
//     const normalizeText = (text) => {
//         if (!text) return '';
//         return text.toLowerCase().replace(/[^a-z0-9]/g, '');
//     };

//     const filteredFoods = allFoods.filter(item => {
//         const q = normalizeText(query);

//         if (!q) return true;

//         const dishMatch = normalizeText(item.name || item.title).includes(q) ||
//                           normalizeText(item.description).includes(q);

//         let kitchenName = '';
//         if (item.foodPartner && item.foodPartner.name) {
//             kitchenName = normalizeText(item.foodPartner.name);
//         } else if (item.foodPartnerName) {
//             kitchenName = normalizeText(item.foodPartnerName);
//         }

//         const kitchenMatch = kitchenName.includes(q);

//         return dishMatch || kitchenMatch;
//     });

//     return (
//         <main className="search-page">
//             <style>{`
//                 .search-page {
//                     min-height: 100vh;
//                     background: #050505;
//                     padding: 20px 0 100px;
//                     box-sizing: border-box;
//                     font-family: system-ui, -apple-system, sans-serif;
//                     position: relative;
//                 }

//                 .search-page::before {
//                     content: '';
//                     position: fixed;
//                     top: 0; left: 0; right: 0;
//                     height: 140px;
//                     background: linear-gradient(180deg, #050505 20%, transparent 100%);
//                     z-index: 90;
//                     pointer-events: none;
//                 }

//                 .search-bar-wrap {
//                     position: sticky;
//                     top: 20px;
//                     z-index: 100;
//                     padding: 0 20px;
//                     max-width: 600px;
//                     margin: 0 auto 22px;
//                     animation: dropIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
//                 }

//                 @keyframes dropIn {
//                     from { opacity: 0; transform: translateY(-12px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }

//                 .search-input-shell {
//                     position: relative;
//                     width: 100%;
//                     border-radius: 20px;
//                     background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%);
//                     border: 1px solid rgba(255,255,255,0.12);
//                     backdrop-filter: blur(20px);
//                     -webkit-backdrop-filter: blur(20px);
//                     box-shadow: 0 10px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
//                     transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
//                     cursor: text;
//                 }

//                 .search-input-shell:focus-within {
//                     border-color: ${ACCENT};
//                     box-shadow: 0 10px 34px rgba(234,88,12,0.28), inset 0 1px 0 rgba(255,255,255,0.08);
//                     background: linear-gradient(135deg, rgba(234,88,12,0.10) 0%, rgba(255,255,255,0.03) 100%);
//                 }

//                 .search-icon {
//                     position: absolute;
//                     left: 18px;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     color: #7d7d7d;
//                     display: flex;
//                     align-items: center;
//                     transition: color 0.25s ease;
//                     pointer-events: none;
//                 }

//                 .search-input-shell:focus-within .search-icon {
//                     color: ${ACCENT};
//                 }

//                 .search-input {
//                     width: 100%;
//                     padding: 16px 46px 16px 50px;
//                     border-radius: 20px;
//                     border: none;
//                     background: transparent;
//                     color: #fff;
//                     font-size: 16px;
//                     font-weight: 500;
//                     outline: none;
//                     box-sizing: border-box;
//                 }

//                 .search-input::placeholder {
//                     color: #6b6b6b;
//                     font-weight: 400;
//                 }

//                 .clear-btn {
//                     position: absolute;
//                     right: 16px;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     background: rgba(255,255,255,0.12);
//                     color: #fff;
//                     border: none;
//                     border-radius: 50%;
//                     width: 26px;
//                     height: 26px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     cursor: pointer;
//                     font-size: 13px;
//                     line-height: 1;
//                     transition: background 0.2s ease, transform 0.15s ease;
//                 }

//                 .clear-btn:hover {
//                     background: ${ACCENT};
//                     transform: translateY(-50%) scale(1.08);
//                 }

//                 .result-meta {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 0 24px;
//                     color: #6b6b6b;
//                     font-size: 13px;
//                     font-weight: 500;
//                     letter-spacing: 0.2px;
//                     animation: fadeIn 0.3s ease;
//                 }

//                 .result-meta strong {
//                     color: #d4d4d4;
//                     font-weight: 600;
//                 }

//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }

//                 /* Loading skeleton — echoes the shape of a real reel card
//                    instead of a generic spinner */
//                 .skeleton-wrap {
//                     max-width: 600px;
//                     margin: 12px auto 0;
//                     padding: 0 20px;
//                     display: flex;
//                     flex-direction: column;
//                     gap: 16px;
//                 }

//                 .skeleton-card {
//                     position: relative;
//                     height: 70vh;
//                     min-height: 420px;
//                     border-radius: 24px;
//                     overflow: hidden;
//                     background: #101010;
//                     border: 1px solid rgba(255,255,255,0.06);
//                 }

//                 .skeleton-shimmer {
//                     position: absolute;
//                     inset: 0;
//                     background: linear-gradient(100deg, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.02) 70%);
//                     background-size: 200% 100%;
//                     animation: shimmer 1.6s ease-in-out infinite;
//                 }

//                 @keyframes shimmer {
//                     0% { background-position: 200% 0; }
//                     100% { background-position: -200% 0; }
//                 }

//                 .skeleton-text-block {
//                     position: absolute;
//                     left: 20px;
//                     right: 90px;
//                     bottom: 28px;
//                     display: flex;
//                     flex-direction: column;
//                     gap: 10px;
//                 }

//                 .skeleton-line {
//                     height: 12px;
//                     border-radius: 6px;
//                     background: rgba(255,255,255,0.08);
//                 }

//                 .skeleton-side-icons {
//                     position: absolute;
//                     right: 16px;
//                     bottom: 100px;
//                     display: flex;
//                     flex-direction: column;
//                     gap: 22px;
//                 }

//                 .skeleton-dot {
//                     width: 32px;
//                     height: 32px;
//                     border-radius: 50%;
//                     background: rgba(255,255,255,0.08);
//                 }

//                 /* Empty state */
//                 .empty-state {
//                     text-align: center;
//                     margin-top: 15vh;
//                     padding: 0 32px;
//                     animation: fadeIn 0.4s ease;
//                 }

//                 .empty-icon-ring {
//                     width: 72px;
//                     height: 72px;
//                     margin: 0 auto 18px;
//                     border-radius: 50%;
//                     background: linear-gradient(135deg, rgba(234,88,12,0.16), rgba(255,255,255,0.03));
//                     border: 1px solid rgba(234,88,12,0.25);
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     font-size: 28px;
//                 }

//                 .empty-state h3 {
//                     margin: 0 0 6px 0;
//                     color: #fff;
//                     font-size: 18px;
//                     font-weight: 700;
//                     letter-spacing: -0.2px;
//                 }

//                 .empty-state p {
//                     margin: 0 auto;
//                     max-width: 280px;
//                     font-size: 14px;
//                     color: #7d7d7d;
//                     line-height: 1.5;
//                 }

//                 .empty-reset {
//                     margin-top: 18px;
//                     padding: 10px 20px;
//                     border-radius: 14px;
//                     border: 1px solid rgba(255,255,255,0.14);
//                     background: rgba(255,255,255,0.04);
//                     color: #e5e5e5;
//                     font-size: 13px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: border-color 0.2s ease, background 0.2s ease;
//                 }

//                 .empty-reset:hover {
//                     border-color: ${ACCENT};
//                     background: rgba(234,88,12,0.1);
//                 }
//             `}</style>

//             <div className="search-bar-wrap">
//                 <div
//                     className="search-input-shell"
//                     onClick={() => inputRef.current && inputRef.current.focus()}
//                 >
//                     <span className="search-icon">
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="11" cy="11" r="8"></circle>
//                             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                         </svg>
//                     </span>

//                     <input
//                         ref={inputRef}
//                         type="text"
//                         className="search-input"
//                         placeholder="Search for a dish or kitchen..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         autoComplete="off"
//                         aria-label="Search for a dish or kitchen"
//                     />

//                     {query && (
//                         <button
//                             onClick={(e) => { e.stopPropagation(); setQuery(''); }}
//                             className="clear-btn"
//                             aria-label="Clear search"
//                             type="button"
//                         >
//                             &times;
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {!isLoading && query && (
//                 <div className="result-meta">
//                     <strong>{filteredFoods.length}</strong> {filteredFoods.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
//                 </div>
//             )}

//             {isLoading ? (
//                 <div className="skeleton-wrap" role="status" aria-label="Loading">
//                     {[0, 1].map((i) => (
//                         <div className="skeleton-card" key={i}>
//                             <div className="skeleton-shimmer" />
//                             <div className="skeleton-text-block">
//                                 <div className="skeleton-line" style={{ width: '40%' }} />
//                                 <div className="skeleton-line" style={{ width: '75%' }} />
//                                 <div className="skeleton-line" style={{ width: '55%' }} />
//                             </div>
//                             <div className="skeleton-side-icons">
//                                 <div className="skeleton-dot" />
//                                 <div className="skeleton-dot" />
//                                 <div className="skeleton-dot" />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : filteredFoods.length > 0 ? (
//                 <ReelFeed items={filteredFoods} emptyMessage="No reels found." />
//             ) : (
//                 <div className="empty-state">
//                     <div className="empty-icon-ring">🔍</div>
//                     <h3>No results found</h3>
//                     <p>We couldn't find any dishes or kitchens matching &ldquo;{query}&rdquo;.</p>
//                     <button className="empty-reset" onClick={() => setQuery('')} type="button">
//                         Clear search
//                     </button>
//                 </div>
//             )}
//         </main>
//     );
// };

// export default Search;













import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReelFeed from '../../components/ReelFeed';

const ACCENT = '#ea580c';

const Search = () => {
    const [query, setQuery] = useState('');
    const [allFoods, setAllFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchAllFoods = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food', { withCredentials: true });
                const foodsArray = Array.isArray(response.data) ? response.data : (response.data.foodItems || response.data.foods || []);
                setAllFoods(foodsArray);
            } catch (error) {
                console.error("Error fetching foods for search:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllFoods();
    }, []);

    // Normalizes text so "Dimple's Kitchen" and "dimples kitchen" match
    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const filteredFoods = allFoods.filter(item => {
        const q = normalizeText(query);

        if (!q) return true;

        const dishMatch = normalizeText(item.name || item.title).includes(q) ||
                          normalizeText(item.description).includes(q);

        let kitchenName = '';
        if (item.foodPartner && item.foodPartner.name) {
            kitchenName = normalizeText(item.foodPartner.name);
        } else if (item.foodPartnerName) {
            kitchenName = normalizeText(item.foodPartnerName);
        }

        const kitchenMatch = kitchenName.includes(q);

        return dishMatch || kitchenMatch;
    });

    return (
        <main className="search-page">
            <style>{`
                .search-page {
                    min-height: 100vh;
                    background: #050505;
                    padding: 20px 0 100px;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, sans-serif;
                    position: relative;
                }

                .search-page::before {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: 140px;
                    background: linear-gradient(180deg, #050505 20%, transparent 100%);
                    z-index: 90;
                    pointer-events: none;
                }

                .search-bar-wrap {
                    position: sticky;
                    top: 20px;
                    z-index: 100;
                    padding: 0 20px;
                    max-width: 600px;
                    margin: 0 auto 22px;
                    animation: dropIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .search-input-shell {
                    position: relative;
                    width: 100%;
                    border-radius: 20px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%);
                    border: 1px solid rgba(255,255,255,0.12);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
                    transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
                    cursor: text;
                }

                .search-input-shell:focus-within {
                    border-color: ${ACCENT};
                    box-shadow: 0 10px 34px rgba(234,88,12,0.28), inset 0 1px 0 rgba(255,255,255,0.08);
                    background: linear-gradient(135deg, rgba(234,88,12,0.10) 0%, rgba(255,255,255,0.03) 100%);
                }

                .search-icon {
                    position: absolute;
                    left: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #7d7d7d;
                    display: flex;
                    align-items: center;
                    transition: color 0.25s ease;
                    pointer-events: none;
                }

                .search-input-shell:focus-within .search-icon {
                    color: ${ACCENT};
                }

                .search-input {
                    width: 100%;
                    padding: 16px 46px 16px 50px;
                    border-radius: 20px;
                    border: none;
                    background: transparent;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 500;
                    outline: none;
                    box-sizing: border-box;
                }

                .search-input::placeholder {
                    color: #6b6b6b;
                    font-weight: 400;
                }

                .clear-btn {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.12);
                    color: #fff;
                    border: none;
                    border-radius: 50%;
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 13px;
                    line-height: 1;
                    transition: background 0.2s ease, transform 0.15s ease;
                }

                .clear-btn:hover {
                    background: ${ACCENT};
                    transform: translateY(-50%) scale(1.08);
                }

                .result-meta {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 0 24px;
                    color: #6b6b6b;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.2px;
                    animation: fadeIn 0.3s ease;
                }

                .result-meta strong {
                    color: #d4d4d4;
                    font-weight: 600;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Loading skeleton — echoes the shape of the Explore grid
                   instead of a generic spinner */
                .skeleton-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px;
                    max-width: 600px;
                    margin: 12px auto 0;
                }

                @media (min-width: 700px) {
                    .skeleton-grid { max-width: 900px; grid-template-columns: repeat(4, 1fr); gap: 3px; }
                }

                .skeleton-tile {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    background: #101010;
                }

                .skeleton-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(100deg, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.02) 70%);
                    background-size: 200% 100%;
                    animation: shimmer 1.6s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .skeleton-shimmer { animation: none; }
                }

                /* Empty state */
                .empty-state {
                    text-align: center;
                    margin-top: 15vh;
                    padding: 0 32px;
                    animation: fadeIn 0.4s ease;
                }

                .empty-icon-ring {
                    width: 72px;
                    height: 72px;
                    margin: 0 auto 18px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(234,88,12,0.16), rgba(255,255,255,0.03));
                    border: 1px solid rgba(234,88,12,0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                }

                .empty-state h3 {
                    margin: 0 0 6px 0;
                    color: #fff;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.2px;
                }

                .empty-state p {
                    margin: 0 auto;
                    max-width: 280px;
                    font-size: 14px;
                    color: #7d7d7d;
                    line-height: 1.5;
                }

                .empty-reset {
                    margin-top: 18px;
                    padding: 10px 20px;
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.14);
                    background: rgba(255,255,255,0.04);
                    color: #e5e5e5;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: border-color 0.2s ease, background 0.2s ease;
                }

                .empty-reset:hover {
                    border-color: ${ACCENT};
                    background: rgba(234,88,12,0.1);
                }
            `}</style>

            <div className="search-bar-wrap">
                <div
                    className="search-input-shell"
                    onClick={() => inputRef.current && inputRef.current.focus()}
                >
                    <span className="search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>

                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search for a dish or kitchen..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoComplete="off"
                        aria-label="Search for a dish or kitchen"
                    />

                    {query && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setQuery(''); }}
                            className="clear-btn"
                            aria-label="Clear search"
                            type="button"
                        >
                            &times;
                        </button>
                    )}
                </div>
            </div>

            {!isLoading && query && (
                <div className="result-meta">
                    <strong>{filteredFoods.length}</strong> {filteredFoods.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                </div>
            )}

            {isLoading ? (
                <div className="skeleton-grid" role="status" aria-label="Loading">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div className="skeleton-tile" key={i}>
                            <div className="skeleton-shimmer" />
                        </div>
                    ))}
                </div>
            ) : filteredFoods.length > 0 ? (
                <ReelFeed items={filteredFoods} emptyMessage="No reels found." isGridMode={true} />
            ) : (
                <div className="empty-state">
                    <div className="empty-icon-ring">🔍</div>
                    <h3>No results found</h3>
                    <p>We couldn't find any dishes or kitchens matching &ldquo;{query}&rdquo;.</p>
                    <button className="empty-reset" onClick={() => setQuery('')} type="button">
                        Clear search
                    </button>
                </div>
            )}
        </main>
    );
};

export default Search;

