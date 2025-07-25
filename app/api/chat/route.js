import dbConnect from "@/lib/dbConnect";
import { generateAIResponse } from "@/lib/generateAIResponse";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("Received conversation request.");

  try {
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { text } = body;
    let { conversationId } = body; // Make conversationId mutable with let

    // Log the incoming request details for debugging
    console.log("Incoming request details:", {
      textProvided: !!text,
      textLength: text?.length,
      conversationId: conversationId,
    });

    // Input validation
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      console.error(
        "Validation error: 'text' is required and must be a non-empty string."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Text is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    // Ensure conversationId is provided and is a string if we intend to save
    if (!conversationId || typeof conversationId !== "string") {
      console.error(
        "Validation error: 'conversationId' is required and must be a string."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Conversation ID is required and must be a string.",
        },
        { status: 400 }
      );
    }

    // Generate AI response using the shared utility function
    const { description: aiDescription, isError: isAiError } =
      await generateAIResponse(text);

    // If there was an AI error, return an error response
    if (isAiError) {
      console.error("AI processing error occurred:", aiDescription);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate AI response. Please try again later.",
          details: aiDescription,
        },
        { status: 500 }
      );
    }

    const currentDate = new Date().toISOString();

    // Prepare the message data to be saved/returned
    const newMessage = {
      question: {
        date: currentDate,
        value: text, // User's original question
      },
      answer: {
        date: currentDate,
        value: aiDescription, // AI's response or error message
        ...(isAiError && { error: true }), // Add error flag if AI failed
      },
    };

    console.log(
      "New message object prepared for DB:",
      JSON.stringify(newMessage, null, 2)
    );

    // Connect to the database
    await dbConnect();
    console.log("Database connected successfully.");

    // Update existing conversation
    console.log("Attempting to update conversation:", conversationId);
    console.log("New message to add:", JSON.stringify(newMessage, null, 2));

    // First, verify the conversation exists
    // Try to find by id field first, then by _id
    let query = { $or: [{ id: conversationId }, { _id: conversationId }] };

    const existing = await Conversation.findOne(query);
    console.log("Existing conversation:", existing ? "Found" : "Not found");

    if (existing) {
      console.log("Current data array length:", existing.data?.length || 0);
      console.log(
        "Current data array:",
        JSON.stringify(existing.data || [], null, 2)
      );

      // Update conversationId to match the found document's id
      if (existing.id) {
        conversationId = existing.id;
      } else if (existing._id) {
        conversationId = existing._id.toString();
      }
    }

    const updateOperation = {
      $push: {
        data: newMessage,
      },
      $set: {
        updatedAt: new Date(),
      },
    };

    console.log("Update operation:", JSON.stringify(updateOperation, null, 2));

    // Use the same query pattern as the find operation
    const updateQuery = {
      $or: [{ id: conversationId }, { _id: conversationId }],
    };

    const result = await Conversation.findOneAndUpdate(
      updateQuery,
      updateOperation,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );

    console.log("Update result:", result ? "Success" : "Failed");

    if (!result) {
      console.warn("Conversation not found:", conversationId);
      return NextResponse.json(
        {
          success: false,
          error: "Conversation not found. Please create a conversation first.",
        },
        { status: 404 }
      );
    }

    console.log("Successfully updated conversation:", result.id);

    // Prepare final response to the client
    const responseData = {
      success: true,
      data: newMessage, // Return the newly added message
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    };

    console.log("Returning successful response.");
    return NextResponse.json(responseData);
  } catch (error) {
    // Catch any unexpected errors during the process.
    console.error("POST API encountered an unhandled error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
