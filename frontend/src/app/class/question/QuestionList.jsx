import MarkdownRenderer from '@components/MarkdownRenderer';
import { changeNavbarPage, selectNavbarState, updateQuestionId } from '@components/navbar/navbarSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Segment, Header } from 'semantic-ui-react';
import { selectUser } from '@src/app/auth/authSlice';

export default function QuestionList({ questions, selectedQuestion }) {
  const dispatch = useDispatch();
  return (
    <Segment>
      <Header as='h3'>Choose a Question</Header>
      <List selection>
        {questions.map((question, index) => (
          <List.Item
            key={question.id}
            onClick={() => {
              dispatch(updateQuestionId(question.id));
            }}
            active={selectedQuestion && selectedQuestion.id === question.id}
          >
            {`Question ${index + 1}`}
            {/* <MarkdownRenderer render={question.question} components={{ h1: 'h3' }} /> */}
          </List.Item>
        ))}
      </List>
    </Segment>
  );
}
