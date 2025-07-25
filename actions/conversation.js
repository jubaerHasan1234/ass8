// import dbConnect from "@/lib/dbConnect";
// import Conversation from "@/models/Conversation";

// /**
//  * Create a new conversation and save it to MongoDB
//  * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
//  */
// export async function createConversation() {
//   try {
//     // Connect to MongoDB
//     await dbConnect();

//     // Generate unique ID
//     const conversationId = Date.now().toString();

//     // Prepare data
//     const conversationData = {
//       id: conversationId,
//       title: "New Conversation",
//       data: [],
//     };

//     // Validate required fields
//     const requiredFields = ["id", "title", "data"];
//     const missingFields = requiredFields.filter(
//       (field) => !conversationData[field]
//     );
//     if (missingFields.length > 0) {
//       throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
//     }

//     // Save to DB
//     const conversation = new Conversation(conversationData);
//     const savedConversation = await conversation.save();

//     if (!savedConversation) {
//       throw new Error("Failed to save conversation to database");
//     }

//     return {
//       success: true,
//       data: {
//         id: savedConversation.id,
//         title: savedConversation.title,
//         data: savedConversation.data,
//       },
//     };
//   } catch (error) {
//     console.error("createConversation error:", error);
//     return { success: false, error: error.message || "Unknown error" };
//   }
// }
