import { test, expect } from "playwright/test";
import { boilerQuestionToJsonQuestion } from "../func/question.js";

test("test boilerQuestionToJsonQuestion given a valid boilerQuestion to return a valid JsonQuestion without error", function () {
  const boilerQuestion = {
    id: "91839a1e-5f61-4ac7-a05f-75b97967004a",
    type: "MULTIPLE_CHOICE",
    data: {
      body: "The cart is negotiating a turn of radius R at a constant speed $v$. The boom B is being raised relative to the cart at a constant rate $\\omega$.\n\nFind simple expressions for the following:\n(a). The angular velocity  of the boom relative to the ground, $^f \\bar{\\omega}^B$ \n\n(b). The angular acceleration of  the boom relative to the ground $^f \\bar{\\alpha}^B$.",
      solution: [],
      answerChoices: [],
    },
    topics: [
      {
        id: "08338f4a-373e-489b-96b1-7697285d7081",
        name: "Basic Kinematic Equation (BKE)",
      },
      { id: "5b610b76-81aa-4ce8-9725-bbe621a6b2d6", name: "Complex Rotations" },
    ],
    explanation: {
      resources: [
        {
          type: "VIDEO",
          data: { url: "https://www.youtube.com/watch?v=kgI2LSynSmQ&t=3s" },
          questionId: null,
          answerChoiceId: null,
          explanationId: "78fec6e4-1f7c-43e8-8f51-676acae91b63",
        },
      ],
    },
    resources: [
      {
        type: "IMAGE",
        data: {
          url: "https://boilerexams-production.s3.us-east-2.amazonaws.com/lnSfi_KeeSb0RX8bpYGBZ",
        },
        questionId: "91839a1e-5f61-4ac7-a05f-75b97967004a",
        answerChoiceId: null,
        explanationId: null,
      },
    ],
    children: [],
  };
  const result = boilerQuestionToJsonQuestion(boilerQuestion);
  expect(result).toBeTruthy();
});
