import express from "express";
import { getPuppyRecommendation } from "../controllers/puppy.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/puppy-recommendation", verifyToken, getPuppyRecommendation);

export default router;
