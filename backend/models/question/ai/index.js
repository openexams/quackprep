import sqlExe from "#db/dbFunctions.js";
import { openai } from "#config/config";

export async function generateQuestionLike(user_id, likeQuestion) {
  const quackAssist = await openai.beta.assistants.retrieve(
    "asst_a168JvA9PlzK2WaKZ6oukDe4"
  );

  // start a thread here
}
