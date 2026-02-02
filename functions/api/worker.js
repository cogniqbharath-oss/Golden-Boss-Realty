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
      const { messages } = await request.json();
      const apiKey = env.GEMINI_API_KEY; 
      const model = "gemini-1.5-flash";

      const systemPrompt = "You are a luxury real estate assistant for Golden Boss Realty in Zirakpur, India. You are professional, helpful, and sophisticated. You promote 'Pavitra Luxury Residences' and other premium projects. Contact: +91 84333 73100 / +91 89509 76000. Goal: Capture leads (name, budget, type) and encourage WhatsApp contact or site visits.";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...messages.map(m => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }]
            }))
          ]
        })
      });

      const data = await response.json();
      let aiText = "I'm sorry, I'm having trouble connecting to the property database. Please call us at +91 84333 73100.";
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        aiText = data.candidates[0].content.parts[0].text;
      }

      return new Response(JSON.stringify({ response: aiText }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
