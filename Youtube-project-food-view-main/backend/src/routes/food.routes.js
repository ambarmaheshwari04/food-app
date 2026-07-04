const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
})

/* POST /api/food/ [protected] */
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("mama"),
    foodController.createFood
)

/* GET /api/food/ [public/protected fetch] */
router.get("/",
    foodController.getFoodItems
)

/* POST /api/food/like [protected] */
router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood
)

/* POST /api/food/save [protected] */
router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)

/* GET /api/food/save [protected] */
router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)

/* POST /api/food/analytics [protected] - SWITCHED TO POST TO MATCH BODY PARSING INDUSTRY STANDARDS */
router.post('/analytics',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.getFoodAnalytics
)

/* DELETE /api/food/:id [protected] */
router.delete("/:id",
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
)

/* ==========================================================================
   📌 NEW EXPANSION TASK - STOCK INDICATOR MANAGEMENT ROUTE 
   ========================================================================== */
/* POST /api/food/out-of-stock [protected] */
router.post('/out-of-stock', 
    authMiddleware.authFoodPartnerMiddleware, 
    foodController.toggleOutOfStock
);
/* POST /api/food/pin [protected] */
router.post('/pin', 
    authMiddleware.authFoodPartnerMiddleware, 
    foodController.togglePinFood
);

module.exports = router;