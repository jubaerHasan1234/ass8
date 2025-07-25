"use server";
import { revalidatePath } from "next/cache";
import Conversation from "../models/Conversation";
import dbConnect from "./dbConnect";

/**
 * Fetches all conversations from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of conversations.
 */
export default async function getAllPromptConversations() {
  await dbConnect();

  try {
    // Using .lean() for faster read operations, as it returns plain JavaScript objects.
    const conversations = await Conversation.find({ status: "prompt" })
      .sort({ createdAt: -1 })
      .lean();
    revalidatePath("/");
    return conversations.map((convo) => ({
      id: convo._id.toString(),
      title: convo.title || "Untitled Conversation",
    }));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Could not fetch conversations.");
  }
}
