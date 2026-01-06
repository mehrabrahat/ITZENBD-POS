
import { GoogleGenAI } from "@google/genai";
import { Order } from "../types";

// Initializing GoogleGenAI as per guidelines (must use named parameter and process.env.API_KEY directly)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (orders: Order[]) => {
  if (orders.length === 0) return "Not enough data for insights yet.";

  const orderSummary = orders.map(o => ({
    total: o.total,
    items: o.items.map(i => i.name),
    time: new Date(o.createdAt).toLocaleTimeString()
  }));

  const prompt = `
    As a restaurant management consultant, analyze the following recent orders and provide a 3-sentence summary:
    1. Key revenue performance.
    2. Most popular item trends.
    3. One specific recommendation for the manager.

    Data: ${JSON.stringify(orderSummary.slice(-10))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Accessing .text as a property as per guidelines (not a method)
    return response.text || "Insight analysis failed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to load AI insights at this time.";
  }
};
