/**
 * Types for objects I use a lot. I have no idea how to use typescript but seems cool.
 */

type Option = {
  text: string;
  is_correct: boolean;
};

export type GenQuestion = {
  question: string;
  options: Option[];
};
