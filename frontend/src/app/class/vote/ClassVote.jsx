import { Button, Icon, Segment, Statistic } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { upsertVoteOnClass } from './classVoteSlice';
import { selectClassState } from '../classSlice';
import { selectItemById } from 'maddox-js-funcs';
import { selectLoadingState } from '@app/store/loadingSlice';
import Upvote from '@components/Upvote';

export default function ClassVote({ class_id }) {
  const loading = useSelector(selectLoadingState).loadingComps?.ClassVote;
  const curClass = selectItemById(useSelector(selectClassState), 'id', class_id);
  const upvotes = curClass?.upvotes;
  const dispatch = useDispatch();

  const handleVote = (vote) => {
    dispatch(upsertVoteOnClass(class_id, vote));
  };

  return (
    <Segment floated='right' basic loading={loading}>
      <Upvote upvotes={upvotes} onSubmit={handleVote} />
    </Segment>
  );
}
