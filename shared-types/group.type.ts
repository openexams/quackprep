import { GenQuestion } from "./question.types";
export type GenGroup = {
  group_name: string;
  group_type: string; // topic || exam
  group_description: string;
  questions: GenQuestion[];
};
