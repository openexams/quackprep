import { useState } from 'react';
import { List, Segment, Header, Button, Checkbox, Icon, Label } from 'semantic-ui-react';
import QuestionCard from './QuestionCard';
import { isFavoriteQuestion, selectFavoriteQuestionsState } from '@src/app/favorite/favoriteSlice';
import { useSelector } from 'react-redux';
import { doesQuestionHaveCurrentChoice, selectCurrentChoicesState } from './choices/choicesSlice';
import GenerateQuestion from './ai/GenerateQuestion';

/**
 * @param {Object} props
 * @param {any[]} props.questions
 * @param {Object} props.selectedQuestion
 */
export default function QuestionList({ questions, selectedQuestion }) {
  const favoriteQuestions = useSelector(selectFavoriteQuestionsState);
  const [showTopics, setShowTopics] = useState(false); // TODO SHOW MULTIPLE TOPICS IF THE QUESTION HAS SUCH
  const currentChoices = useSelector(selectCurrentChoicesState);

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

      {/* Wrapping List in a scrollable container */}
      <div style={{ maxHeight: '33rem', overflowY: 'auto' }}>
        <List selection divided relaxed>
          {questions.map((question, index) => (
            <QuestionCard
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
          <GenerateQuestion />
        </List>
      </div>
    </Segment>
  );
}
