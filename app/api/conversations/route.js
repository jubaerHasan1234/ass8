import dbConnect from "@/lib/dbConnect";
import { generateAIResponse } from "@/lib/generateAIResponse";
import Conversation from "@/models/Conversation";
import { convertMongoIdToString } from "@/utils/convertMongoIdToString";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    // Connect to database

    await dbConnect();

    // Parse request body to get status, default to 'prompt' if not provided
    const {
      status = "prompt",
      text,
      questionDate,
    } = await request.json().catch(() => ({}));

    // Validate status value
    const validStatuses = ["prompt", "suggestion"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status. Must be 'prompt' or 'suggestion'",
        },
        { status: 400 }
      );
    }
    // Input validation for both 'text' and 'questionDate'
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

    if (
      !questionDate ||
      typeof questionDate !== "string" ||
      questionDate.trim().length === 0
    ) {
      console.error(
        "Validation error: 'questionDate' is required and must be a non-empty string."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Question date is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    // Generate AI response using the utility function
    const {
      title: aiTitle,
      description: aiDescription,
      isError: isAiError,
    } = await generateAIResponse(text);

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

    // Prepare the message data to be saved/returned
    const currentDate = new Date().toISOString();

    // Create conversation with initial data including status
    const conversationData = {
      title: aiTitle, // Use the AI-generated title
      data: [
        {
          question: {
            value: text,
            date: questionDate,
          },
          answer: {
            value: aiDescription,
            date: currentDate,
          },
        },
      ],
      status,
    };

    // Validate conversation data before saving
    const requiredFields = ["title", "data", "status"];
    const missingFields = requiredFields.filter(
      (field) => !conversationData[field]
    );
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Create and save the conversation with proper validation
    const conversation = new Conversation(conversationData);

    // Manually set the title to ensure it's not undefined
    conversation.title = conversation.title || "New Conversation";

    const savedConversation = await conversation.save();

    if (!savedConversation) {
      throw new Error("Failed to save conversation to database");
    }

    // Prepare response with title
    const response = {
      id: convertMongoIdToString(savedConversation._id),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
