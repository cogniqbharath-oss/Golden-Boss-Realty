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
      const apiKey = env.API_KEY_golden;
      const model = "gemma-3-27b-it";

      const systemPrompt = `You are "Goldie", the luxury AI assistant for Golden Boss Realty in Zirakpur, India.
      Your goal is to guide visitors through a professional lead qualification process and build trust.

      PROJECTS:
      1. Pavitra Luxury Residences (VIP Road): 3/4 BHK Luxury apartments with a premium clubhouse.
      2. The Golden Heights (Nagla Road): High-end residential with premium finishes and 24/7 security.
      3. Boss Business Park (Patiala Road): Commercial investment with high ROI potential.

      TONE: Professional, sophisticated, helpful, and luxury-oriented.

      CONVERSATION FLOW:
      1. Greet the visitor warmly.
      2. Ask if they are looking to Buy, Invest, or Rent.
      3. Ask for the Property Type (Residential/Commercial).
      4. Ask for their Budget Range.
      5. Ask for their Preferred Location in or around Zirakpur.
      6. Capture their Name and Phone Number to arrange a site visit or callback.
      7. If they show high interest (hot lead), provide the WhatsApp link: https://wa.me/918433373100

      RULES:
      - Be concise but polite.
      - If they ask general questions about Zirakpur real estate, answer them using your knowledge.
      - Always steer back to capturing requirements if they haven't provided them.
      - Use bullet points for project details.
      - If the user provides their contact details, confirm that a "Senior Investment Advisor" will call them within 2 hours.

      CONTACT INFO:
      - Phone: +91 84333 73100
      - Address: Zirakpur, Punjab.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
