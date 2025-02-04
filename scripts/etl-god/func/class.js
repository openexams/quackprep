import { fetchWithExponetialBackoff } from "../axios.js";
import { BoilerClassSchema, JSONClassSchema } from "../schema/schema.js";

// hard coded class categories
function subjectToCategoryNumber(subject) {
  switch (subject) {
    case "Computer Sciences":
      return 1;
    case "Mathematics":
      return 2;
    case "Economics":
      return 3;
    case "Biological Sciences":
      return 4;
    case "Chemistry":
      return 5;
    case "Physics":
      return 6;
    case "Aero & Astro Engineering":
    case "Electrical & Computer Engr":
      return 9;
    case "Statistics":
      return 10;
    case "Psychology":
      return 7;
    default:
      return 8;
  }
}

/**
 * @param {Object} options
 * @param {string} options.subject get all classes for this subject
 * @param {string} options.courseName get class by course name
 * @returns {import("../types.js").JSONClass[]}
 */
export async function getBoilerClassAndParseToJsonClass(options) {
  const result = await fetchWithExponetialBackoff("/courses/subjects");
  const validated = BoilerClassSchema.array().parse(result);
  const JSON = [];
  for (let i = 0; i < validated.length; i++) {
    // go through subjects
    if (
      options &&
      options.subject &&
      validated[i].subject !== options.subject
    ) {
      continue;
    }
    for (let j = 0; j < validated[i].courses.length; j++) {
      const curCourse = validated[i].courses[j];
      if (
        options &&
        options.courseName &&
        curCourse.abbreviation + curCourse.number !== options.courseName
      ) {
        continue;
      }
      console.log("curCourseId", curCourse.id);
      // go through courses in that subject
      const name = curCourse.abbreviation + curCourse.number;
      const description = curCourse.name;
      const category = subjectToCategoryNumber(validated[i].subject);

      const school_id = 1;
      const questionCount = curCourse.stats.questions;
      JSON.push({
        name,
        description,
        category,
        school_id,
        groups: null,
        questionCount,
      });
    }
  }

  return JSONClassSchema.array().parse(JSON);
}
