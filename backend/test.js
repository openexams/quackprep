import { openai } from "#config/config.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract the event information." },
    {
      role: "user",
      content: "Alice and Bob are going to a science fair on Friday.",
    },
  ],
  response_format: zodResponseFormat(CalendarEvent, "event"),
});

const event = completion.choices[0].message.parsed;

console.log(event);
