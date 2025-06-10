import express from "express";
import { getMessages, sendMessage, updateRelationshipType } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
// import { updateRelationshipType } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/updateRelationship/:id", protectRoute, updateRelationshipType);
// router.put("/updateRelationship/:id", protectRoute, (req, res) => {
//   console.log("✅ 路由真的命中了");
//   res.send("OK");
// });


export default router;
