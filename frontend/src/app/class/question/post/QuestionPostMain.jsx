import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Comment, Segment, Header } from 'semantic-ui-react';
import { selectQuestionPosts, getQuestionPostsByQuestionId } from './questionPostSlice';
import { forAllParentsCallAddChildren } from '@utils/helperFuncs';
import QuestionPost from './QuestionPost';
import QuestionPostInput from './QuestionPostInput';
import { selectLoadingState } from '@app/store/loadingSlice';

export default function QuestionPostMain({ questionId }) {
  const loading = useSelector(selectLoadingState).loadingComps?.QuestionPostMain;
  const dispatch = useDispatch();
  // Get the raw posts from Redux. (Adjust the selector if needed.)
  const rawPosts = useSelector(selectQuestionPosts(questionId));

  // Build a nested structure of posts (with children attached) using useMemo to avoid unnecessary recomputation.
  const questionPosts = useMemo(() => {
    return rawPosts ? forAllParentsCallAddChildren(structuredClone(rawPosts), 'post_id') : [];
  }, [rawPosts]);

  // Fetch posts if none exist for the current questionId.
  useEffect(() => {
    if (questionId && (!rawPosts || rawPosts.length === 0)) {
      dispatch(getQuestionPostsByQuestionId(questionId));
    }
  }, [dispatch, questionId, rawPosts]);

  /**
   * Recursively renders a comment and its nested replies.
   * @param {import('../../../../../../types.ts').QuestionPostSelect} qpost - The current post.
   * @returns {React.ReactNode}
   */
  function renderComments(qpost) {
    return (
      <QuestionPost
        id={qpost.id}
        deleted={qpost.deleted}
        key={qpost.id}
        post_id={qpost.post_id}
        username={qpost.username}
        user_id={qpost.created_by}
        icon={qpost.icon}
        text={qpost.text}
        updated_at={qpost.updated_at}
        question_id={questionId}
      >
        {qpost?.children != null ? qpost.children.map((child) => <div key={child.id}>{renderComments(child)}</div>) : null}
      </QuestionPost>
    );
  }

  return (
    <Segment raised padded loading={loading}>
      <Header>Question Forum</Header>
      <Comment.Group threaded>
        {questionPosts?.length > 0 ? (
          questionPosts.map((qpost) => renderComments(qpost))
        ) : (
          <p>No posts yet. Be the first to ask!</p>
        )}
      </Comment.Group>
      <QuestionPostInput question_id={questionId} />
    </Segment>
  );
}
