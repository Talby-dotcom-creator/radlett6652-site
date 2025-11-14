import type { Handler } from "@netlify/functions";
import { OpenAI } from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { image_url } = body;

    if (!image_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing image_url" }),
      };
    }

    const prompt = `
      Provide a short, descriptive ALT text for the image.
      Do NOT say "Image of".
      Limit to 14–18 words.
    `;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "input_text", text: "Generate alt text:" },
            { type: "input_image", image_url, detail: "auto" },
          ],
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ alt: response.output_text }),
    };
  } catch (error) {
    console.error("Alt-text generation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate alt text" }),
    };
  }
};

import type { Request, Response } from "express";
module.exports = async function handler(req: Request, res: Response) {
  try {
    const { image_url } = req.body;

    const prompt = `
        You are an expert accessibility describer.
        Provide a short but highly descriptive ALT text for the following image.
        Do NOT say "Image of". 
        Max 14–18 words. 
        Focus on important visual details only.
    `;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "input_text", text: "Generate alt text:" },
            { type: "input_image", image_url, detail: "auto" },
          ],
        },
      ],
    });

    const altText = response.output_text;

    res.status(200).json({ alt: altText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate alt text" });
  }
};
