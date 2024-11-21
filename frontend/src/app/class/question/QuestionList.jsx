import MarkdownRenderer from '@components/MarkdownRenderer';
import { changeNavbarPage, selectNavbarState, updateQuestionId } from '@components/navbar/navbarSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { List, Segment, Header } from 'semantic-ui-react';

export default function QuestionList({ questions, selectedQuestion }) {
  const { schoolName, className, groupType, groupName } = useSelector(selectNavbarState).navbar;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <Segment>
      <Header as='h3'>Choose a Question</Header>
      <List selection>
        {questions.map((question, index) => (
          <List.Item
            key={question.id}
            onClick={() => {
              dispatch(
                changeNavbarPage(
                  navigate,
                  `/class/${schoolName}/${className}/${groupType}/${groupName}/question/${parseInt(question.id)}`,
                ),
              );
              dispatch(updateQuestionId(parseInt(question.id)));
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
