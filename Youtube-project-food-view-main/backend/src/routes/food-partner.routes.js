const express = require('express');
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* GET /api/food-partner/:id */
// router.get("/:id", (req, res, next) => {
//     if (req.params.id === 'me' || req.headers['x-requested-with'] === 'XMLHttpRequest') {
//         return next();
//     }
//     if (authMiddleware && authMiddleware.authUserMiddleware) {
//         return authMiddleware.authUserMiddleware(req, res, next);
//     }
//     next();
// }, foodPartnerController.getFoodPartnerById);


/* GET /api/food-partner/:id */
router.get("/:id", foodPartnerController.getFoodPartnerById);

/* DELETE /api/food-partner/delete-reel/:id */
router.delete('/delete-reel/:id', async (req, res) => {
  try {
    const reelId = req.params.id;
    const foodModel = require('../models/food.model');
    
    await foodModel.findByIdAndDelete(reelId); 
    
    return res.status(200).json({ 
      success: true, 
      message: "Reel deleted successfully from database." 
    });
  } catch (error) {
    console.error("Database Delete Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during database operation." 
    });
  }
});

/* PUT /api/food-partner/toggle-status/:id */
router.put('/toggle-status/:id', async (req, res) => {
  try {
    // Note: Make sure this path matches your actual Food Partner model file name
    const foodPartnerModel = require('../models/foodpartner.model'); 
    
    const currentPartner = await foodPartnerModel.findById(req.params.id);
    
    if (!currentPartner) {
        return res.status(404).json({ success: false, message: "Partner not found" });
    }
    
    currentPartner.isAcceptingOrders = !currentPartner.isAcceptingOrders;
    await currentPartner.save();
    
    return res.json({ success: true, isAcceptingOrders: currentPartner.isAcceptingOrders });
  } catch (err) {
    console.error("Toggle Status Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;