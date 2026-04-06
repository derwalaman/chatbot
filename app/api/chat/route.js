import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message, image } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let result;

    if (image) {
      // ✅ NEW CORRECT FORMAT
      result = await model.generateContent([
        message || "Describe this image",
        {
          inlineData: {
            mimeType: "image/jpg", // change if needed
            data: image,
          },
        },
      ]);
    } else {
      result = await model.generateContent(message);
    }

    const response = await result.response;
    const text = response.text();

    return Response.json({ reply: text });

  } catch (error) {
    console.error("Gemini Error:", error);

    return Response.json({
      reply: "⚠️ Error processing request",
    });
  }
}