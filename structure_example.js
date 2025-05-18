
// Configuring a schema on the model is the recommended way to generate JSON, 
// because it constrains the model to output JSON.

// Configuring a schema (recommended)

// To constrain the model to generate JSON, configure a responseSchema. 
// The model will then respond to any prompt with JSON-formatted output.

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ "GOOGLE_API_KEY" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
      "List a few popular cookie recipes, and include the amounts of ingredients.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeName: {
              type: Type.STRING,
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
          propertyOrdering: ["recipeName", "ingredients"],
        },
      },
    },
  });

  console.log(response.text);
}

main();