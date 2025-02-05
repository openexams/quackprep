import { useState } from 'react';
import { List, Segment, Header, Button, Checkbox, Icon, Label } from 'semantic-ui-react';
import QuestionCard from './QuestionCard';
import { isFavoriteQuestion, selectFavoriteQuestionsState } from './favorite/favoriteSlice';
import { useSelector } from 'react-redux';
import { doesQuestionHaveCurrentChoice, selectCurrentChoicesState } from './choices/choicesSlice';
import GenerateQuestion from './ai/GenerateQuestion';
import { selectCanAndIsEdit } from '@app/auth/authSlice';
import { selectNavbarState } from '@app/layout/navbar/navbarSlice';
import QuestionEditor from '@app/creator/forms/QuestionEditor';

/**
 * List of questions that can be selected
 * @param {Object} props
 * @param {any[]} props.questions
 * @param {Object} props.selectedQuestion
 * @param {Boolean} props.showAIQuestions
 * @param {Function} props.setShowAIQuestions
 */
export default function QuestionList({ questions, selectedQuestion, setSelectedQuestion, showAIQuestions, setShowAIQuestions }) {
  // for edit
  const { groupId } = useSelector(selectNavbarState).navbar; // used for autofill
  const edit = useSelector(selectCanAndIsEdit());
  //
  const favoriteQuestions = useSelector(selectFavoriteQuestionsState);
  const [showTopics, setShowTopics] = useState(false);

  const currentChoices = useSelector(selectCurrentChoicesState);

  return (
    <>
      <Segment>
        <Header as='h3' style={{ marginBottom: '0.2rem' }}>
          Choose a Question
        </Header>
        <div style={{ marginBottom: '1rem' }}>
          <Checkbox
            label={{ children: 'Show AI', style: { fontSize: '0.9em', color: 'rgba(0,0,0,0.6)' } }}
            checked={showAIQuestions}
            onChange={() => setShowAIQuestions(!showAIQuestions)}
            style={{ fontSize: '0.9em', marginRight: '.5rem' }}
          />
          <Checkbox
            label={{ children: 'Show topics', style: { fontSize: '0.9em', color: 'rgba(0,0,0,0.6)' } }}
            checked={showTopics}
            onChange={() => setShowTopics(!showTopics)}
            style={{ fontSize: '0.9em' }}
          />
        </div>

        {/* Wrapping List in a scrollable container */}
        <div style={{ maxHeight: '33rem', minHeight: '33rem', overflowY: 'auto' }}>
          <List selection divided relaxed>
            {edit ? <QuestionEditor group_ids={groupId} /> : null}
            {questions?.map((question, index) => (
              <QuestionCard
                question={question}
                setSelectedQuestion={setSelectedQuestion}
                ai={question.ai}
                key={index}
                id={question?.id}
                selectedQuestion={selectedQuestion}
                type_name={question.type_name}
                group_name={question.group_name}
                showTopics={showTopics}
                index={index}
                current={doesQuestionHaveCurrentChoice(currentChoices, question.id)}
                favorited={isFavoriteQuestion(favoriteQuestions, question.id)}
              />
            ))}
          </List>
        </div>
      </Segment>
      <Segment style={{ marginTop: '-.5em' }}>
        <GenerateQuestion />
      </Segment>
    </>
  );
}
