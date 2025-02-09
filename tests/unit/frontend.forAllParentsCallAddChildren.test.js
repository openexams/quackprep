import { test, expect } from "playwright/test";
import { forAllParentsCallAddChildren } from "@frontend/src/utils/helperFuncs.js";

test("given posts that need to be setup differently, call forAllParentsCallAddChildren which will correctly give posts children arrays, where each child array contains the children posts (ie a reply to a post or a reply to a reply to a post) expect it to correctly output this hierarchical structure", function () {
  const qposts = [
    {
      id: 1,
      question_id: 64,
      text: "i love this question",
      post_id: null,
      deleted: 0,
      created_by: 13,
      updated_at: "2025-02-07T20:41:14.000Z",
      username: "Admin",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpCbCKzn7lBvb-MsO3UvQayN3mHZg3n2qMlg&s",
    },
    {
      id: 2,
      question_id: 64,
      text: "well i dont",
      post_id: 1,
      deleted: 0,
      created_by: 13,
      updated_at: "2025-02-08T13:04:36.000Z",
      username: "Admin",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpCbCKzn7lBvb-MsO3UvQayN3mHZg3n2qMlg&s",
    },
    {
      id: 3,
      question_id: 64,
      text: "well I DO!",
      post_id: 2,
      deleted: 0,
      created_by: 13,
      updated_at: "2025-02-08T14:12:16.000Z",
      username: "Admin",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpCbCKzn7lBvb-MsO3UvQayN3mHZg3n2qMlg&s",
    },
  ];
  const result = forAllParentsCallAddChildren(qposts, "post_id");
  expect(result[0].children.length).toEqual(1);
  expect(result[0].children[0].children.length).toEqual(1);

  expect(result).toStrictEqual([
    {
      id: 1,
      question_id: 64,
      text: "i love this question",
      post_id: null,
      deleted: 0,
      created_by: 13,
      updated_at: "2025-02-07T20:41:14.000Z",
      username: "Admin",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpCbCKzn7lBvb-MsO3UvQayN3mHZg3n2qMlg&s",
      children: [
        {
          id: 2,
          question_id: 64,
          text: "well i dont",
          post_id: 1,
          deleted: 0,
          created_by: 13,
          updated_at: "2025-02-08T13:04:36.000Z",
          username: "Admin",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpCbCKzn7lBvb-MsO3UvQayN3mHZg3n2qMlg&s",
          children: [
            {
              id: 3,
              question_id: 64,
              text: "well I DO!",
              post_id: 2,
              deleted: 0,
              created_by: 13,
              updated_at: "2025-02-08T14:12:16.000Z",
              username: "Admin",
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpCbCKzn7lBvb-MsO3UvQayN3mHZg3n2qMlg&s",
            },
          ],
        },
      ],
    },
  ]);
});
