import type { Handler } from "@netlify/functions";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPTS = {
  alt: `
    Generate a single alt text sentence (14-18 words).
    Do NOT say "Image of".
    Describe the subject, mood, setting, colours and key detail.
  `,
  caption: `
    Write a 1-sentence caption suitable for a blog article.
    Must be human-sounding, warm, descriptive, and under 20 words.
  `,
  ocr: `
    Extract ALL text that is visible inside the image.
    Return ONLY the detected words.
  `,
} as const;

type PromptMode = keyof typeof PROMPTS;

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { image_url, mode } = body as {
      image_url?: string;
      mode?: string;
    };

    if (!image_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing image_url" }),
      };
    }

    const promptKey: PromptMode =
      mode && (mode as PromptMode) in PROMPTS
        ? (mode as PromptMode)
        : "alt";
    const prompt = PROMPTS[promptKey].trim();

    const result = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: prompt }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Please analyse the attached image and respond accordingly.",
            },
            { type: "input_image", image_url },
          ],
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: result.output_text,
        mode: promptKey,
      }),
    };
  } catch (error) {
    console.error("Error generating alt text:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate alt text" }),
    };
  }
};
