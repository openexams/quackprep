import {
  randomizeArray,
  selectMutlipleBinarySearch,
} from "../../shared/globalFuncs.js";
import { test, expect } from "playwright/test";

test("given an arr to randomize with 5 elements, call randomizeArr, assert its the same size as the og arr", () => {
  const array = [0, 1, 2, 3, 4];
  const randomized = randomizeArray(array);
  expect(randomized.length).toBe(5);
});

test("given a sorted array by a certain id run selectMutlipleBinarySearch, assert it retursn correct elems", () => {
  const array = [
    {
      id: 284,
      answer: "(2, 1, 1)",
      is_correct: 0,
      created_by: 13,
      question_id: 64,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 285,
      answer: "(3, 0, 11)",
      is_correct: 0,
      created_by: 13,
      question_id: 64,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 286,
      answer: "(3, 1, 7)",
      is_correct: 0,
      created_by: 13,
      question_id: 64,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 287,
      answer: "(1, 1, -2)",
      is_correct: 0,
      created_by: 13,
      question_id: 64,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 288,
      answer: "(2, 0, 6)",
      is_correct: 1,
      created_by: 13,
      question_id: 64,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 289,
      answer: "[0, ∞)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 290,
      answer: "(0, ∞)",
      is_correct: 1,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 291,
      answer: "[0, 1)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 292,
      answer: "(1, ∞)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 293,
      answer: "(-∞, ∞)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 294,
      answer: "⟨0, -2, 3⟩ + t⟨-2, -1, 3⟩",
      is_correct: 1,
      created_by: 13,
      question_id: 66,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 295,
      answer: "⟨0, 2, 3⟩ + t⟨-2, -1, 3⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 66,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 296,
      answer: "⟨-2, -1, -1⟩ + t⟨0, 2, -1⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 66,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 297,
      answer: "⟨-2, 1, -1⟩ + t⟨1, 1, 1⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 66,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 298,
      answer: "⟨0, 2, -3⟩ + t⟨-2, 1, 3⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 66,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 299,
      answer: "-2",
      is_correct: 0,
      created_by: 13,
      question_id: 67,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 300,
      answer: "1",
      is_correct: 1,
      created_by: 13,
      question_id: 67,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 301,
      answer: "-1",
      is_correct: 0,
      created_by: 13,
      question_id: 67,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 302,
      answer: "2",
      is_correct: 0,
      created_by: 13,
      question_id: 67,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 303,
      answer: "0",
      is_correct: 0,
      created_by: 13,
      question_id: 67,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 304,
      answer: "10",
      is_correct: 0,
      created_by: 13,
      question_id: 68,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 305,
      answer: "8",
      is_correct: 1,
      created_by: 13,
      question_id: 68,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 306,
      answer: "5",
      is_correct: 0,
      created_by: 13,
      question_id: 68,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 307,
      answer: "4",
      is_correct: 0,
      created_by: 13,
      question_id: 68,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 308,
      answer: "2",
      is_correct: 0,
      created_by: 13,
      question_id: 68,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 309,
      answer: "-1/2 ⟨-1, -1, 0⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 69,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 310,
      answer: "3/2 ⟨1, 2, 1⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 69,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 311,
      answer: "-1/2 ⟨1, 2, 1⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 69,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 312,
      answer: "-3/2 ⟨1, 2, 1⟩",
      is_correct: 0,
      created_by: 13,
      question_id: 69,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 313,
      answer: "-3/2 ⟨-1, -1, 0⟩",
      is_correct: 1,
      created_by: 13,
      question_id: 69,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 314,
      answer: "4/3",
      is_correct: 1,
      created_by: 13,
      question_id: 70,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 315,
      answer: "-4/3",
      is_correct: 0,
      created_by: 13,
      question_id: 70,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 316,
      answer: "-4",
      is_correct: 0,
      created_by: 13,
      question_id: 70,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 317,
      answer: "0",
      is_correct: 0,
      created_by: 13,
      question_id: 70,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 318,
      answer: "4",
      is_correct: 0,
      created_by: 13,
      question_id: 70,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 319,
      answer: "-2",
      is_correct: 0,
      created_by: 13,
      question_id: 71,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 320,
      answer: "4",
      is_correct: 1,
      created_by: 13,
      question_id: 71,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 321,
      answer: "2",
      is_correct: 0,
      created_by: 13,
      question_id: 71,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 322,
      answer: "-4",
      is_correct: 0,
      created_by: 13,
      question_id: 71,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 323,
      answer: "8",
      is_correct: 0,
      created_by: 13,
      question_id: 71,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 324,
      answer: "19",
      is_correct: 0,
      created_by: 13,
      question_id: 72,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 325,
      answer: "25",
      is_correct: 1,
      created_by: 13,
      question_id: 72,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 326,
      answer: "22",
      is_correct: 0,
      created_by: 13,
      question_id: 72,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 327,
      answer: "24",
      is_correct: 0,
      created_by: 13,
      question_id: 72,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 328,
      answer: "20",
      is_correct: 0,
      created_by: 13,
      question_id: 72,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 329,
      answer: "2√2",
      is_correct: 0,
      created_by: 13,
      question_id: 73,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 330,
      answer: "-√2",
      is_correct: 0,
      created_by: 13,
      question_id: 73,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 331,
      answer: "√2/2",
      is_correct: 0,
      created_by: 13,
      question_id: 73,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 332,
      answer: "5√2",
      is_correct: 0,
      created_by: 13,
      question_id: 73,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 333,
      answer: "√2",
      is_correct: 1,
      created_by: 13,
      question_id: 73,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 334,
      answer: "Hyperboloid of two sheets",
      is_correct: 1,
      created_by: 13,
      question_id: 74,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 335,
      answer: "Hyperboloid of one sheet",
      is_correct: 0,
      created_by: 13,
      question_id: 74,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 336,
      answer: "Hyperbolic paraboloid",
      is_correct: 0,
      created_by: 13,
      question_id: 74,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 337,
      answer: "Elliptic paraboloid",
      is_correct: 0,
      created_by: 13,
      question_id: 74,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 338,
      answer: "Elliptic cone",
      is_correct: 0,
      created_by: 13,
      question_id: 74,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 339,
      answer: "(1, -1, 0)",
      is_correct: 0,
      created_by: 13,
      question_id: 75,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 340,
      answer: "(1, 1, 0)",
      is_correct: 1,
      created_by: 13,
      question_id: 75,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 341,
      answer: "(5, 5, 0)",
      is_correct: 0,
      created_by: 13,
      question_id: 75,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 342,
      answer: "(-5, -5, 0)",
      is_correct: 0,
      created_by: 13,
      question_id: 75,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 343,
      answer: "(0, 0, 0)",
      is_correct: 0,
      created_by: 13,
      question_id: 75,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
  ];

  const result = selectMutlipleBinarySearch(array, "question_id", 65);
  expect(result).toStrictEqual([
    {
      id: 289,
      answer: "[0, ∞)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 290,
      answer: "(0, ∞)",
      is_correct: 1,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 291,
      answer: "[0, 1)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 292,
      answer: "(1, ∞)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
    {
      id: 293,
      answer: "(-∞, ∞)",
      is_correct: 0,
      created_by: 13,
      question_id: 65,
      type: "mcq",
      class_id: 6,
      group_id: 29,
      school_id: 1,
      class_category: 2,
    },
  ]);
});
