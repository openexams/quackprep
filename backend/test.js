import { sendAiMessageChainAndRecieveResult } from "#utils/openAi.js";

const res = await sendAiMessageChainAndRecieveResult([
  { role: "system", content: "Extract the event information." },
  {
    role: "user",
    content: "Alice and Bob are going to a science fair on Friday.",
  },
]);

console.log(res);
