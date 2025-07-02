import { Request, Response } from "express";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";


// Add items to user cart
const addToCart = async (req : Request, res : Response) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (!userData) {
      res.json({ success: false, message: "User not found" });
      return;
    }
    const cartData  = userData.cartData as Record<string,number>

    const foodItem = await foodModel.findById(req.body.itemId);
    if (!foodItem) {
      res.json({ success: false, message: "Food item not found" });
      return;
    }
    // Check subscription
    if (!userData.subscription) {
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const currentHour = new Date().getHours();
      const currentSlot = currentHour < 15 ? "Lunch" : "Dinner";

      // Validate non-subscriber's order
      if (foodItem.day !== currentDay || foodItem.timeSlot !== currentSlot) {
        res.json({
          success: false,
          message: `Non-subscribers can only order meals available for ${currentDay} ${currentSlot}.`,
        });
        return;
      }
    }

    // Proceed if validation passes
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
// Remove items from user cart
const removeFromCart = async (req : Request, res : Response) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      res.json({ success: false, message: "User not found" });
      return;
    }
    let cartData = userData.cartData as Record<string,number>

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.log("Error");
    res.json({ success: false, message: "error" });
  }
};

// Fetch user cart data
const getCart = async (req : Request, res : Response) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      res.json({ success: false, message: "User not found" });
      return;
    }
    let cartData = userData.cartData as Record<string,number>

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
