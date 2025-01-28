import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { List, Label, Icon, Popup } from 'semantic-ui-react';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import { updateQuestionId } from '@app/layout/navbar/navbarSlice';
import { upsertFavoriteQuestion } from './favorite/favoriteSlice';
import { selectNavbarState } from '@app/layout/navbar/navbarSlice';
import FavoriteIcon from './favorite/FavoriteIcon';
import { selectItemById } from 'maddox-js-funcs';

/**
 *
 * @param {*} questionTypes
 * @param {*} questionGroupName
 * @returns {Array}
 */
function getQuestionTopics(questionTypes, questionGroupName) {
  questionTypes = questionTypes.split(',');

  questionGroupName = questionGroupName.split(',');
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
// takes in everything i need to be a question
export default function QuestionCard({
  question,
  id,
  setSelectedQuestion,
  selectedQuestion,
  type_name,
  group_name,
  showTopics,
  index,
  favorited,
  current,
  ai,
}) {
  const dispatch = useDispatch();
  return (
    <List.Item
      key={id}
      onClick={() => {
        setSelectedQuestion(question);
      }}
      active={selectedQuestion && selectedQuestion.id === id}
      style={{
        padding: '0.8em',
        display: 'flex',
        flexDirection: 'column', // Ensure content stacks vertically
        alignItems: 'flex-start',
      }}
    >
      {/* Top-aligned content */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left-aligned content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', flex: 1 }}>
          <List.Header as='h4' style={{ margin: 0 }}>
            Question {index + 1}
          </List.Header>

          {current !== null && (
            <Icon
              size='tiny'
              circular
              bordered
              inverted
              name={current ? 'check' : 'x'}
              color={current ? 'green' : 'red'}
              style={{ marginRight: '0.5em' }}
            />
          )}
          {ai ? <Popup trigger={<Label size='mini' color='blue' content={'AI'} />}>AI generated question</Popup> : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <FavoriteIcon onClick={() => dispatch(upsertFavoriteQuestion(null, id, !favorited))} favorited={favorited} />
        </div>
      </div>

      {/* Topics section - moved to the bottom */}
      {showTopics &&
        getQuestionTopics(type_name, group_name) &&
        getQuestionTopics(type_name, group_name).map((g_name, index) => (
          <List.Description key={'tp' + index} style={{ margin: '0.5em 0' }}>
            <Label
              circular
              color='grey'
              style={{
                fontSize: '0.9em',
                fontWeight: 'bold',
                padding: '1em',
              }}
            >
              {g_name}
            </Label>
          </List.Description>
        ))}
    </List.Item>
  );
}
