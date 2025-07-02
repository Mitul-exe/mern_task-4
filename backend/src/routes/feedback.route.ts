import express from "express";
import feedbackController from "../controllers/feedbackController.js"; // Import the specific method from the controller
const feedbackRouter = express.Router();

feedbackRouter.post("/add", feedbackController); // Use the specific method for the route

export default feedbackRouter;