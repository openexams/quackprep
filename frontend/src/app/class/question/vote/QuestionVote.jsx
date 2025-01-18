import { useDispatch } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { upsertVoteOnQuestion } from './questionVoteSlice';

export default function QuestionVote({ questionId }) {
  const dispatch = useDispatch();
  //   const votes = 1; could show x votes at somepoint

  const handleVote = (type) => {
    dispatch(upsertVoteOnQuestion(questionId, type));
  };
  if (!questionId) return null;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '.2rem' }}>
      <Button.Group size='medium'>
        <Button icon compact color='teal' onClick={() => handleVote(1)}>
          <Icon name='thumbs up outline' />
        </Button>

        <Button icon compact color='pink' onClick={() => handleVote(0)}>
          <Icon name='thumbs down outline' />
        </Button>
      </Button.Group>
    </div>
  );
}
