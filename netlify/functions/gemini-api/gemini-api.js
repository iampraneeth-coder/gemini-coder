exports.handler = async (event) => {
  try {
    // 1. Log that the function was called
    console.log("Function 'gemini-api' was invoked!");

    // 2.  Get the API key from the environment (even if empty!)
    const apiKey = process.env.GEMINI_API_KEY || "API_KEY_NOT_SET";

    // 3.  Log the API key (or the fact that it's missing)
    console.log("GEMINI_API_KEY:", apiKey);

    // 4. Create the Reply

    let replyText;
    if (apiKey === "API_KEY_NOT_SET") {
      replyText = "API Key not set. Add to Netlify settings!";
    } else {
      replyText = "Function ran! Check API Key in the Gemini API Setting";
    }

    // 5. Send the Reply
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ reply: replyText }),
    };
  } catch (error) {
    console.error("Error in function:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Function failed!" }),
    };
  }
};
