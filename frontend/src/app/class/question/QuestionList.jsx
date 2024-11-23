import MarkdownRenderer from '@components/MarkdownRenderer';
import { changeNavbarPage, selectNavbarState, updateQuestionId } from '@components/navbar/navbarSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { List, Segment, Header, Button, Checkbox, Icon, Label } from 'semantic-ui-react';

/**
 *
 * @param {*} questionTypes
 * @param {*} questionGroupName
 * @returns {Array}
 */
function getQuestionTopics(questionTypes, questionGroupName) {
  if (!Array.isArray(questionTypes) && questionTypes === 'topic') {
    return [questionGroupName];
  }
  //else they are arrays we must go through them.
  const ret = [];
  let added = false;
  for (let i = 0; i < questionTypes.length; i++) {
    if (questionTypes[i] === 'topic') {
      ret.push(questionGroupName[i]);
      added = true;
    }
  }
  if (added === false) return null;
  return ret;
}

export default function QuestionList({ questions, selectedQuestion }) {
  const { schoolName, className, groupType, groupName } = useSelector(selectNavbarState).navbar;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showTopics, setShowTopics] = useState(false); // TODO SHOW MULTIPLE TOPICS IF THE QUESTION HAS SUCH
  return (
    <Segment>
      <Header as='h3' style={{ marginBottom: '0.2rem' }}>
        Choose a Question
      </Header>
      <div style={{ marginBottom: '1rem' }}>
        <Checkbox
          label={{ children: 'Show topics', style: { fontSize: '0.9em', color: 'rgba(0,0,0,0.6)' } }}
          checked={showTopics}
          onChange={() => setShowTopics(!showTopics)}
          style={{ fontSize: '0.9em' }}
        />
      </div>

      <List selection divided relaxed>
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
            style={{ padding: '0.8em' }}
          >
            <List.Content>
              <List.Header as='h4' style={{ marginBottom: showTopics ? '0.5em' : '0' }}>
                Question {index + 1}
              </List.Header>
              {showTopics &&
                getQuestionTopics(question.type_name, question.group_name) &&
                getQuestionTopics(question.type_name, question.group_name).map((g_name, index) => (
                  <List.Description key={'tp' + index} style={{ marginBottom: '0.5em' }}>
                    <Label circular color='grey' style={{ fontSize: '0.9em', fontWeight: 'bold', padding: '1em' }}>
                      {/* <Icon name='tag' style={{ marginRight: '0.5em' }} /> */}
                      {g_name}
                    </Label>
                  </List.Description>
                ))}
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  );
}
