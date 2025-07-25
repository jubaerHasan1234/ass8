import dbConnect from "@/lib/dbConnect";
import Conversation from "@/models/Conversation";
import parseJsonResponse from "@/utils/parseJsonResponse";
import { GoogleGenAI, Type } from "@google/genai"; // Type is still useful for schema definition
import { NextResponse } from "next/server";

// Initialize Google AI with error handling
let ai;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Google AI initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Google AI:", error);
  throw error; // This will prevent the app from starting if AI initialization fails
}

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

    const { text, conversationId } = body;

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
    console.log(text);

    let aiTitle = "New Conversation";
    let aiDescription = "No response generated.";
    let isAiError = false;

    try {
      const structuredAiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: text,
        generationConfig: {
          // responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["title", "description"],
            propertyOrdering: ["title", "description"],
          },
        },
      });

      console.log("Step 2: Received structured response from Gemini AI.");

      if (!structuredAiResponse || !structuredAiResponse.text) {
        throw new Error("Structured AI response was invalid or empty.");
      }

      // Function to parse JSON that might be wrapped in markdown code blocks or handle non-JSON responses

      const data = parseJsonResponse(structuredAiResponse.text);
      console.log("Parsed AI response:", data);

      // Validate and provide default values for AI response fields
      aiTitle =
        (data.title && typeof data.title === "string" && data.title.trim()) ||
        "New Conversation";
      aiDescription =
        (data.description &&
          typeof data.description === "string" &&
          data.description.trim()) ||
        "No description available.";
    } catch (aiProcessingError) {
      isAiError = true;
      console.error(
        "Error processing AI response (either initial or structured):",
        {
          error: aiProcessingError.message,
          stack: aiProcessingError.stack,
        }
      );
      aiDescription =
        "We encountered an issue processing your request. Please try again later.";
      aiTitle = "AI Service Error";
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
      title: aiTitle,
    };

    console.log(
      "New message object prepared for DB:",
      JSON.stringify(newMessage, null, 2)
    );

    // Connect to the database
    await dbConnect();
    console.log("Database connected successfully.");

    // Use findOneAndUpdate with upsert: true to simplify logic
    const updateOperation = {
      $push: {
        data: newMessage,
      },
      $set: {
        updatedAt: new Date(),
      },
      $setOnInsert: {
        id: conversationId,
        createdAt: new Date(),
        title: aiTitle, // Set initial title only on creation
      },
    };

    console.log("Attempting to save/update conversation:", conversationId);
    const result = await Conversation.findOneAndUpdate(
      { id: conversationId },
      updateOperation,
      {
        new: true, // Return the updated document
        upsert: true, // Create the document if it doesn't exist
        setDefaultsOnInsert: true, // Apply default values specified in schema on insert
        runValidators: true, // Run schema validators on update
      }
    );

    if (result) {
      console.log("Successfully saved/updated conversation:", result.id);
    } else {
      console.warn("Failed to save/update conversation, result was null.");
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save or update conversation in database.",
        },
        { status: 500 }
      );
    }

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
