// import dbConnect from "@/lib/dbConnect";
// import mongoose from "mongoose";

// // Import the Conversation schema directly to avoid model compilation issues
// const ConversationSchema = new mongoose.Schema({
//   id: { type: String, required: true, unique: true },
//   title: { type: String, required: true },
//   data: { type: Array, default: [] },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Check if the model exists before compiling it
// const Conversation =
//   mongoose.models.Conversation ||
//   mongoose.model("Conversation", ConversationSchema);

// export default async function firstConversation() {
//   console.log("=== Creating New Conversation ===");

//   try {
//     // Connect to database
//     console.log("Connecting to database...");
//     await dbConnect();

//     // Create conversation with initial empty data and required title
//     const conversationData = {
//       id: crypto.randomUUID(),
//       title: "New Conversation",
//       data: [],
//     };

//     // Validate conversation data before saving
//     const requiredFields = ["title", "data"];
//     const missingFields = requiredFields.filter(
//       (field) => !conversationData[field]
//     );

//     if (missingFields.length > 0) {
//       throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
//     }

//     // Create and save the conversation with proper validation
//     const conversation = new Conversation(conversationData);
//     const savedConversation = await conversation.save();

//     if (!savedConversation) {
//       throw new Error("Failed to save conversation to database");
//     }

//     // Prepare response with title
//     const response = {
//       id: convertMongoIdToString(savedConversation._id),
//     };

//     return response;
//   } catch (error) {
//     console.error("Error creating conversation:", error);
//   }
// }
