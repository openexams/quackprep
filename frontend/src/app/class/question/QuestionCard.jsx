import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { List, Label, Icon } from 'semantic-ui-react';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
import { updateQuestionId } from '@components/navbar/navbarSlice';
import { upsertFavoriteQuestion } from '@src/app/favorite/favoriteSlice';
import { selectNavbarState } from '@components/navbar/navbarSlice';

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
// takes in everything i need to be a question
export default function QuestionCard({ id, selectedQuestion, type_name, group_name, showTopics, index, favorited }) {
  const { schoolName, className, groupType, groupName } = useSelector(selectNavbarState).navbar;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <List.Item
      key={id}
      onClick={() => {
        dispatch(
          changeNavbarPage(navigate, `/class/${schoolName}/${className}/${groupType}/${groupName}/question/${parseInt(id)}`),
        );
        dispatch(updateQuestionId(parseInt(id)));
      }}
      active={selectedQuestion && selectedQuestion.id === id}
      style={{ padding: '0.8em' }}
    >
      <List.Content floated='right'>
        <Icon
          name={favorited ? 'star' : 'star outline'}
          color={favorited ? 'yellow' : null}
          onClick={(e) => {
            dispatch(upsertFavoriteQuestion(null, id, !favorited));
          }}
        />
      </List.Content>
      <List.Content>
        <List.Header as='h4' style={{ marginBottom: showTopics ? '0.5em' : '0' }}>
          Question {index + 1}
        </List.Header>
        {showTopics &&
          getQuestionTopics(type_name, group_name) &&
          getQuestionTopics(type_name, group_name).map((g_name, index) => (
            <List.Description key={'tp' + index} style={{ marginBottom: '0.5em' }}>
              <Label circular color='grey' style={{ fontSize: '0.9em', fontWeight: 'bold', padding: '1em' }}>
                {g_name}
              </Label>
            </List.Description>
          ))}
      </List.Content>
    </List.Item>
  );
}
