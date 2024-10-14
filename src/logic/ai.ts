import OpenAI from "openai";

interface ResponseOptions {
  model: string;
}

/**
 * Boiler plate for using a basic chat model.
 */
export const getResponse = async <T>(
  system: string,
  user: string,
  options?: ResponseOptions
): Promise<T> => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: options?.model || "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: user,
      },
    ],
  });
  return JSON.parse(completion.choices[0].message.content!);
};
