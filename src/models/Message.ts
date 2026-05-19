import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    messages: [messageSchema],
  },
  { timestamps: true },
);

export default mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);
