import { Button, Icon, Header, Segment } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { upsertVoteOnClass } from './classVoteSlice';
import { selectClassState } from '../classSlice';
import { selectItemById } from 'maddox-js-funcs';
import { selectLoadingState } from '@app/store/loadingSlice';

export default function ClassVote({ class_id }) {
  const loading = useSelector(selectLoadingState).loadingComps?.ClassVote;
  const upvotes = selectItemById(useSelector(selectClassState), 'id', class_id).upvotes;
  const dispatch = useDispatch();

  const handleVote = (vote) => {
    dispatch(upsertVoteOnClass(class_id, vote));
  };

  return (
    <Segment floated='right' basic loading={loading} style={{ marginBottom: '10px' }}>
      Vote Here! {upvotes}{' '}
      <Button.Group vertical>
        <Button
          icon
          color='green'
          onClick={(e) => {
            e.stopPropagation();
            handleVote(1);
          }}
          style={{ padding: '8px' }}
          disabled={loading}
          aria-label='Upvote'
        >
          <Icon name='up arrow' />
        </Button>
        <Button
          icon
          color='red'
          onClick={(e) => {
            e.stopPropagation();
            handleVote(0);
          }}
          style={{ padding: '8px' }}
          disabled={loading}
          aria-label='Downvote'
        >
          <Icon name='down arrow' />
        </Button>
      </Button.Group>
    </Segment>
  );
}
