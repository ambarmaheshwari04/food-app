const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })
}

// async function getFoodItems(req, res) {
//     const foodItems = await foodModel.find({})
//     res.status(200).json({
//         message: "Food items fetched successfully",
//         foodItems
//     })
// }

// Inside your food.controller.js
async function getFoodItems(req, res) {
    try {
        // 🚨 ADD .populate('foodPartner') RIGHT HERE 👇
        const foods = await foodModel.find().populate('foodPartner'); 
        
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food items", error: error.message });
    }
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })
}

async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })
}

async function getSaveFood(req, res) {
    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });
}

async function deleteFood(req, res) {
    try {
        const { id } = req.params;

        await foodModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Food deleted successfully"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

async function getFoodAnalytics(req, res) {
    try {
        const { foodId } = req.body;
        const foodItem = await foodModel.findById(foodId);

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        const actualLikes = await likeModel.countDocuments({ food: foodId });
        const actualSaves = await saveModel.countDocuments({ food: foodId });

        res.status(200).json({
            success: true,
            likesCount: actualLikes || foodItem.likeCount || 0,
            savesCount: actualSaves || foodItem.savesCount || 0
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function toggleOutOfStock(req, res) {
    try {
        const { foodId } = req.body;
        const foodItem = await foodModel.findById(foodId);

        if (!foodItem) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        // Toggling the existing status value directly
        foodItem.isOutOfStock = !foodItem.isOutOfStock;
        await foodItem.save();

        res.status(200).json({
            success: true,
            message: `Food stock status updated successfully to ${foodItem.isOutOfStock}`,
            isOutOfStock: foodItem.isOutOfStock
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function togglePinFood(req, res) {
    try {
        const { foodId } = req.body;
        const foodItem = await foodModel.findById(foodId);

        if (!foodItem) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Toggle the pinned status
        foodItem.isPinned = !foodItem.isPinned;
        await foodItem.save();

        res.status(200).json({
            success: true,
            message: `Food pin status updated to ${foodItem.isPinned}`,
            isPinned: foodItem.isPinned
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    deleteFood,
    getFoodAnalytics,
    toggleOutOfStock,
    togglePinFood
};