import { useDispatch, useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import { upsertVoteOnQuestion } from './questionVoteSlice';
import { selectLoadingState } from '@app/store/loadingSlice';
import Upvote from '@components/Upvote';

export default function QuestionVote({ questionId, upvotes }) {
  const loading = useSelector(selectLoadingState).loadingComps?.QuestionVote;
  const dispatch = useDispatch();

  const handleVote = (type) => {
    dispatch(upsertVoteOnQuestion(questionId, type));
  };
  if (!questionId) return null;

  return (
    <Segment
      textAlign='center'
      id={`question_${questionId}_vote`}
      basic
      loading={loading}
      style={{ display: 'inline-flex', alignItems: 'center', padding: '.2rem' }}
    >
      <Upvote upvotes={upvotes} onSubmit={handleVote} />
    </Segment>
  );
}
