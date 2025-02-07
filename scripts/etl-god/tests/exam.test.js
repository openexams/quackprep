import { test, expect } from "playwright/test";
import {
  getExamJsonGroupsFromJsonClass,
  addBoilerQuestionIdsFromGroupToArray,
} from "../func/exam.js";
import { BoilerExamSchema } from "../schema/schema.js";

test("test getJsonGroupsFromJsonClass given a class name, return the correct json groups", async function () {
  const result = await getExamJsonGroupsFromJsonClass({ name: "CS25100" });
  expect(result.groupJson.length).toBeGreaterThanOrEqual(1);
  expect(result.groupJson[0].name.includes("Exam")).toEqual(true);
  expect(result.groupJson[0].type).toEqual("exam");
});

test("test addBoilerQuestionIdsFromGroupToArray given a BoilerTopicSchema object to correctly return all question ids in that group", function () {
  const examJson = JSON.parse(
    '{ "id": "07d63283-3e6e-410e-93ee-dbab6a7def3c", "number": 0, "year": 2007, "season": "SPRING", "disclaimer": "", "courseId": "917504b9-0d67-4558-af71-b5961ee7b962", "flags": { "published": true, "practice": false }, "stats": { "count": 1, "timeSpent": "226887914", "timeSpentVideo": "88566196", "submissions": 573, "submissionsCorrect": 0, "questions": 4, "accuracy": 0, "difficulty": 1.175705794947994 }, "resources": [], "questions": [ { "id": "b4e62772-7b0c-4ad4-a03c-4451ad3330de", "number": 1, "flags": { "published": true, "disableRandomAnswers": true, "answersStartHidden": true }, "stats": { "count": 1, "timeSpent": "76039587", "timeSpentVideo": "26321843", "submissions": 220, "submissionsCorrect": 0, "accuracy": 0, "difficulty": 1.09375 }, "type": "MULTIPLE_CHOICE", "topics": [ { "id": "08338f4a-373e-489b-96b1-7697285d7081", "name": "Basic Kinematic Equation (BKE)", "courseId": "917504b9-0d67-4558-af71-b5961ee7b962", "stats": { "count": 1, "timeSpent": "2526231834", "timeSpentVideo": "413619692", "submissions": 1997, "submissionsCorrect": 0, "questions": 10, "accuracy": 0, "difficulty": 1.2261564139246544 } } ], "children": [] } ] }'
  );
  const boilerExam = BoilerExamSchema.parse(examJson);
  const questionIds = addBoilerQuestionIdsFromGroupToArray(boilerExam);
  expect(questionIds).toEqual(["b4e62772-7b0c-4ad4-a03c-4451ad3330de"]);
});
