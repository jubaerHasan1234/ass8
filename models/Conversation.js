import mongoose from "mongoose";

/**
 * Schema for individual messages in a conversation
 */
const MessageSchema = new mongoose.Schema(
  {
    answer: {
      date: {
        type: String,
        required: [true, "Answer date is required"],
        trim: true,
      },
      value: {
        type: String,
        required: [true, "Answer value is required"],
        trim: true,
      },
    },
    question: {
      date: {
        type: String,
        required: [true, "Question date is required"],
        trim: true,
      },
      value: {
        type: String,
        required: [true, "Question value is required"],
        trim: true,
      },
    },
  },
  {
    _id: false,
    strict: true,
    timestamps: false,
  }
);

/**
 * Main Conversation Schema
 * Represents a conversation thread with multiple messages
 */
const ConversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Conversation ID is required"],
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["prompt", "suggestion"],
        message: "Status must be either 'prompt' or 'suggestion'",
      },
      default: "prompt",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [200, "Title cannot be longer than 200 characters"],
      default: "New Conversation",
    },
    data: {
      type: [MessageSchema],
      required: true,
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v);
        },
        message: (props) => `${props.value} is not a valid array of messages`,
      },
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "conversations",
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add text index for search functionality
ConversationSchema.index({
  title: "text",
  "data.question.value": "text",
  "data.answer.value": "text",
});

// Pre-save hook to ensure required fields
ConversationSchema.pre("save", function (next) {
  if (this.isNew && !this.title.trim()) {
    this.title = "New Conversation";
  }
  next();
});

// Add static methods
ConversationSchema.statics.findByTitle = function (title) {
  return this.find({ title: new RegExp(title, "i") });
};

// Create model if it doesn't exist
export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
