import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { upsertVoteOnQuestion } from './questionVoteSlice';
import { selectLoadingState } from '@app/store/loadingSlice';

export default function QuestionVote({ questionId, upvotes }) {
  const loading = useSelector(selectLoadingState).loadingComps?.QuestionVote;
  const dispatch = useDispatch();

  const handleVote = (type) => {
    dispatch(upsertVoteOnQuestion(questionId, type));
  };
  if (!questionId) return null;

  return (
    <Segment basic loading={loading} style={{ display: 'inline-flex', alignItems: 'center', padding: '.2rem' }}>
      <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{upvotes}</span>
      <Button.Group size='medium' vertical>
        <Button icon compact color='teal' onClick={() => handleVote(1)}>
          <Icon name='up arrow' />
        </Button>

        <Button icon compact color='pink' onClick={() => handleVote(0)}>
          <Icon name='down arrow' />
        </Button>
      </Button.Group>
    </Segment>
  );
}
