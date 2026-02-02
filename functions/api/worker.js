export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const messages = body.messages || [];
      const apiKey = env.API_KEY_golden;

      // Strictly use the requested model
      const model = "gemma-3-27b-it";

      if (!apiKey) {
        return new Response(JSON.stringify({
          response: "Configuration Error: API_KEY_golden is missing in Worker settings."
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const systemPrompt = `You are "Goldie", the luxury AI assistant for Golden Boss Realty in Zirakpur, India.
      PROJECTS: Pavitra Luxury Residences (VIP Road), The Golden Heights (Nagla Road), Boss Business Park (Patiala Road).
      TONE: Professional, luxury, helpful.
      FLOW: 1. Greet, 2. Ask Buy/Invest/Rent, 3. Property Type, 4. Budget, 5. Location, 6. Name/Phone number.
      Confirm a visit or callback once details are provided.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...messages.map(m => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content || "" }]
            }))
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(JSON.stringify({
          response: `AI Error (${response.status}): ${data.error?.message || "Check your API key or Model access."}`
        }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      let aiText = "I'm sorry, I'm having trouble processing your request. Please call +91 84333 73100.";
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      }

      return new Response(JSON.stringify({ response: aiText }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ response: `System Error: ${error.message}` }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
