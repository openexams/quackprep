// IMPORTANT!!! -> IF U CHANGE THIS FILE RUN NPM RUN DEV AGAIN!!!
export const MAX_FILES_UPLOAD = 3;
export const MAX_FILE_SIZE_IN_BYTES = 4 * 1024 * 1024; // 4MB
export const MAX_QUESTIONS_CONTEXT = 10;
export const QUACK_GEN_QUESTION_ASS_ID = "asst_a168JvA9PlzK2WaKZ6oukDe4";
export const QUACK_CREATE_GROUP_ASS_ID = "asst_UXDbP8qIkOJw50jN9OLp36oA";
export const QUACK_GRADE_ASS_ID = "asst_m0Af7T1ZzVNKZqJ4QvFp7a2p";
export const MAX_PROMPT_LENGTH = 40000; // hopefully a pdf parse is no longer than this.
export const MAX_PROMPT_TOKENS = 50000; // $0.01 for 4o-mini // $0.17 for 4o
export const MAX_USER_PROMPT_LENGTH = 5000;
export const MATHPIX_API_PDF_GET_RESULT_RETRIES = 15;
export const MATHPIX_API_PDF_GET_RESULT_SLEEP_TIME_MS = 10000;
export const MAX_USERNAME_LENGTH = 25;
export const MAX_EMAIL_LENGTH = 100;
export const MAX_FIRST_NAME_LENGTH = 50;
export const MAX_LAST_NAME_LENGTH = 50;
export const ADMIN_ACCOUNT_ID = 13;
export const GENERAL_SCHOOL_ID = 4;
export const OTHER_CLASS_CATEGORY_ID = 8;
export const MAX_QUACK_CREATE_GROUP_REQUEST_WAIT_TIME_IN_MS = 900000;
export const MAX_USER_ANSWER_SUBMISSION_LENGTH = 2048; // match sql max varchar len
export const TEST_ACCOUNT_EMAIL = "test69696969696999@urmom.com"; // if someone creates this as they username it will cook everything
export const TEST_ACCOUNT_USER = "test69696969696999";
export const TEST_ACCOUNT_PASS = "test69696969696999"; // secrets? Na, we dont that here
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
export const DOMAIN_NAME = "quackprep.com";

export const NODE_ENVS_AVAILABLE = {
  local: "local",
  test: "test",
  prod: "prod",
};
