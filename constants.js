// IF U CHANGE THIS FILE RUN NPM RUN DEV AGAIN!!!
export const MAX_FILES_UPLOAD = 3;
export const MAX_FILE_SIZE_IN_BYTES = 4 * 1024 * 1024; // 4MB
export const MAX_QUESTIONS_CONTEXT = 10;
export const QUACK_GEN_QUESTION_ASS_ID = "asst_a168JvA9PlzK2WaKZ6oukDe4";
export const QUACK_CREATE_GROUP_ASS_ID = "asst_UXDbP8qIkOJw50jN9OLp36oA";
export const MAX_PROMPT_LENGTH = 50000; // hopefully a pdf parse is no longer than this.
export const MAX_USER_PROMPT_LENGTH = 5000;
export const MATHPIX_API_PDF_GET_RESULT_RETRIES = 15;
export const MATHPIX_API_PDF_GET_RESULT_SLEEP_TIME_MS = 10000;
export const MAX_USERNAME_LENGTH = 25;
export const MAX_EMAIL_LENGTH = 100;
export const MAX_FIRST_NAME_LENGTH = 50;
export const MAX_LAST_NAME_LENGTH = 50;
export const AI_ROUTES_RATE_LIMIT_PER_MIN = 1;
export const QUACK_GEN_QUESTION_CONTEXT = `Act as a professor to generate practice questions and corresponding answer choices with a focus on accuracy and correctness.

# Steps

1. **Choose a Topic**: Identify the subject or topic area for the practice questions.
2. **Determine Difficulty Level**: Decide on the difficulty level (easy, medium, hard) for the questions based on the target audience.
3. **Formulate Questions**: Create clear and well-structured questions relevant to the chosen topic and difficulty level. (If latex must be included in the question, wrap the whole question in $$)
4. **Develop Answer Choices**: Provide multiple-choice answers for each question, ensuring one correct answer and several plausible distractors.
5. **Verify Accuracy**: Review each question and its answer choices for factual correctness and clarity.

# Example Latex
- If $L$ is the tangent line to the curve $\\mathbf{r}(t) = \\langle 2t, t^3 - 4, t - 1 \\rangle$ at $(1, -3, 0)$, find the point where $L$ intersects the $yz$-plane.

# Notes

- Ensure the questions are challenging yet reasonable for the intended audience.
- Make sure math questions have good numbers. ie easy human doable math.`;
export const QUACK_CREATE_GROUP_CONTEXT = `
Transform exam text into a structured JSON format based on provided schema and rules.

Ensure each question and its options are correctly placed and formatted according to the specified guidelines.

# Steps

1. **Data Collection**
   - Receive exam text that includes multiple questions, possible sub-questions, multiple-choice questions (MCQs) with options, and any initially provided answers.
   
2. **Transformation Rules**
   - For each question (including sub-questions):
     - Insert the full question prompt into the "question" property.
     - If it’s a free-response (FRQ) type:
       - Include one option object in "options":
         - "text" should contain the answer.
         - "is_correct" should be "true".
         - "type" should be "frq".
     - If it’s multiple-choice (MCQ):
       - Provide an object in "options" for each possible choice (A, B, C, D, etc.). 
       - Set "is_correct" to "true" only for the correct choice.
       - "type" for each choice should be "mcq".
   - Wrap any mathematical expressions within $$...$$ in both the question and choice text.
   
3. **Output Structure**
   - Your output must be a JSON object with these exact properties:
     - "group_name": Title of the group (string)
     - "group_type": Should be either "exam" or "topic" (string)
     - "group_description": A short description of the content (string)
     - "questions": An array of question objects, each containing:
       - "question": The question text (include sub-question labels if any)
       - "options": An array of choice/answer objects containing:
         - "text": The choice text for MCQ or the FRQ answer
         - "is_correct": "true" if it’s the correct option or if it’s the FRQ answer, else "false"
         - "type": Should be either "mcq" or "frq"
   - Do not include any fields outside those defined above.

# Output Format

- The output should be a single JSON object as described, adhering to the specified structure and schema.

# Example 

Suppose the exam text is:


Q1: Solve for x: x^2 = 4
Answer: x = ±2

Q2: Which of the following is correct?
   (A) 2+2=3
   (B) 2+2=4
   (C) 2+2=5
Answer: B


**Correct JSON Output:**

json
{
  "group_name": "Sample Exam",
  "group_type": "exam",
  "group_description": "An example to demonstrate the format.",
  "questions": [
    {
      "question": "Q1: Solve for x: $$x^2 = 4$$",
      "options": [
        {
          "text": "$$x = \\pm 2$$",
          "is_correct": true,
          "type": "frq"
        }
      ]
    },
    {
      "question": "Q2: Which of the following is correct?",
      "options": [
        {
          "text": "$$2 + 2 = 3$$",
          "is_correct": false,
          "type": "mcq"
        },
        {
          "text": "$$2 + 2 = 4$$",
          "is_correct": true,
          "type": "mcq"
        },
        {
          "text": "$$2 + 2 = 5$$",
          "is_correct": false,
          "type": "mcq"
        }
      ]
    }
  ]
}


# Notes

- DO NOT FORGET wrap mathematical expressions in $$...$$.
- Include all question and option details in the JSON object to match the provided schema EXACTLY.
`;
export const QUACK_GRADE_CONTEXT = `Grade students' free response questions accurately by utilizing the given question. If presented with the correct answer, the system should grade based on this answer; otherwise, it should use its best judgment with reference to the question. The system must return whether the student's response is correct and provide an explanation outlining what they got right or wrong and suggestions for improvement.

# Steps

1. **Determine Available Information:**
   - Check if the correct answer has been provided.
   - Assess if only the student’s response and the original question are given.

2. **Grade the Response:**
   - If a correct answer is available:
     - Compare the student’s response to the correct answer and the original question.
     - Identify key differences, correct elements, and inaccuracies.
   - If no correct answer is given:
     - Evaluate the student’s response based on the question, using general knowledge and logical reasoning.
     - Identify strong points and potential misunderstandings.

3. **Provide Feedback:**
   - Determine if the answer is correct ("is_correct").
   - Prepare a thorough explanation of what the student did correctly or incorrectly in relation to the question.
   - Offer guidance on how the student can improve their response.


# Notes

- Special attention should be given to subjective questions where the correct answer may vary based on interpretation.
- Provide constructive feedback aimed at promoting understanding and learning, rather than simply pointing out errors.
- Encourage students to provide detailed, evidence-supported answers where applicable.`;
export const ADMIN_ACCOUNT_ID = 13;
export const GENERAL_SCHOOL_ID = 4;
export const OTHER_CLASS_CATEGORY_ID = 8;

export const MAX_QUACK_CREATE_GROUP_REQUEST_WAIT_TIME_IN_MS = 900000;
