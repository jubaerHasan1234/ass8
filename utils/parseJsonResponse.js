/**
 * Parses a JSON response that might be wrapped in markdown code blocks
 * @param {string} text - The raw text response to parse
 * @returns {Object} - Parsed object with title and description
 */
const parseJsonResponse = (text) => {
  if (!text) {
    console.warn("Empty response received");
    return { title: "New Conversation", description: "No response generated." };
  }

  // Try to extract JSON from markdown code blocks
  const jsonMatch =
    text.match(/```(?:json\n)?([\s\S]*?)\n```/) ||
    text.match(/```([\s\S]*?)```/);

  const jsonString = jsonMatch ? jsonMatch[1] : text;

  try {
    // Try to parse as JSON
    const parsed = JSON.parse(jsonString);

    // Ensure we have the required fields with defaults
    return {
      title: parsed.title || "New Conversation",
      description: parsed.description || "No description available.",
    };
  } catch (error) {
    console.warn("Failed to parse JSON, using fallback:", error);
    // Fallback: Use the raw text as description and first line as title
    const firstLine = text.split("\n")[0] || "New Conversation";
    return {
      title:
        firstLine.length > 5 ? firstLine.substring(0, 50) : "New Conversation",
      description: text,
    };
  }
};

export default parseJsonResponse;
