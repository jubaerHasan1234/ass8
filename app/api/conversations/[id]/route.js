import dbConnect from "@/lib/dbConnect";
import { generateAIResponse } from "@/lib/generateAIResponse";
import Conversation from "@/models/Conversation";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Find the conversation using _id
    const conversation = await Conversation.findOne({ _id: params.id })
      .lean()
      .exec();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Format the response to match the desired structure
    const formattedData = {
      _id: conversation._id.toString(),
      status: conversation.status || "prompt",
      title: conversation.title || "",
      data: (conversation.data || []).map((msg) => ({
        answer: {
          date: msg.answer?.date || new Date().toISOString(),
          value: msg.answer?.value || "",
        },
        question: {
          date: msg.question?.date || new Date().toISOString(),
          value: msg.question?.value || "",
        },
      })),
    };

    revalidatePath(`/conversation/${params.id}`);
    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation", details: error.message },
      { status: 500 }
    );
  }
}

/* 
 create a conversation api
*/

export async function POST(request, { params }) {
  try {
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { text } = body;
    let { id: conversationId } = params; // Make conversationId mutable with let

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

    // Connect to the database
    await dbConnect();

    // First, verify the conversation exists
    // Try to find by id field first, then by _id
    let query = { $or: [{ id: conversationId }, { _id: conversationId }] };

    const existing = await Conversation.findOne(query);

    if (existing) {
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

    // Prepare final response to the client
    const responseData = {
      success: true,
      data: newMessage, // Return the newly added message
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    };

    revalidatePath(`/conversation/${conversationId}`);
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    // Catch any unexpected errors during the process.
    console.error("POST API encountered an unhandled error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await dbConnect();

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    ).lean();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    revalidatePath(`/`);

    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("Error updating conversation title:", error);
    return NextResponse.json(
      { error: "Failed to update conversation title", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await dbConnect();

    const deletedConversation = await Conversation.findByIdAndDelete(id);

    if (!deletedConversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    revalidatePath(`/`);

    return NextResponse.json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation", details: error.message },
      { status: 500 }
    );
  }
}
