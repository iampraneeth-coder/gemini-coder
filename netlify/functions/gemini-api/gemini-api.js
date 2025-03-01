const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY; // Get API key from environment variables
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GEMINI_API_KEY not set" }),
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const data = JSON.parse(event.body);
    const msg = data.message;

    const result = await model.generateContent(msg);
    const response = result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Important for CORS
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Failed to generate response" }),
    };
  }
};
