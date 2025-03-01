const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY; // Get API key from environment variables
    if (!apiKey) {
      console.error("Error: GEMINI_API_KEY not set in environment variables."); // Log this error
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Important for CORS
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "GEMINI_API_KEY not set" }),
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Updated Model Name

    try {
      const data = JSON.parse(event.body);
      const msg = data.message;
      const history = data.history || []; // Get conversation history from event
      console.log("Received message from client:", msg); //Log the message
      console.log("Current history", history)

      let prompt = "";
      if (history.length > 0) {
        //Create a formated prompt to prime the AI with a certain context
        prompt += "You are a helpful chatbot. Here is the conversation you have had with the user so far:\n"
        history.forEach(m => {
          prompt += `${m.sender}: ${m.message}\n`
        })
        prompt += "Now respond to the user based on this conversation. Reply in a short/helpful/concise tone without being too verbose."
      }

      prompt += msg;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log("Gemini API Response:", text); // Log the API response

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Important for CORS
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ reply: text }),
      };
    } catch (apiError) {
      //Log API Errors
      console.error("Gemini API Error:", apiError);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: `Failed to generate response: ${apiError.message}` }),
      };
    }
  } catch (error) {
    console.error("Function execution error:", error); //Overall function error
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: `Function execution error: ${error.message}` }),
    };
  }
};
