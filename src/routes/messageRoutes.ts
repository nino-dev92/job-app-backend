import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";

import {
  sendMessage,
  getConversation,
  getAllConversations,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", verifyJWT, getAllConversations);
router.post("/", verifyJWT, sendMessage);

router.get("/:userId", verifyJWT, getConversation);

export default router;
