import type { Request, Response } from "express";
import Conversation from "../models/Message.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user?.id;
    const { receiverId, text } = req.body;

    // find existing conversation
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    // create if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // add new message
    conversation.messages.push({
      sender: senderId as any,
      text,
      createdAt: new Date(),
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const otherUserId = req.params.userId;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [userId, otherUserId],
      },
    }).populate("messages.sender", "name");

    if (!conversation) {
      return res.json([]);
    }

    res.json(conversation.messages);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    }).populate("participants", "name email");

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
