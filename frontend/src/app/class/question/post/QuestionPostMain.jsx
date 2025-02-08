import { useSelector } from 'react-redux';
import { selectQuestionPosts } from './questionPostSlice';
import { useDispatch } from 'react-redux';
import { getQuestionPostsByQuestionId } from './questionPostSlice';
import { useEffect } from 'react';
import QuestionPost from './QuestionPost';
import { forAllParentsCallAddChildren } from '@utils/helperFuncs';

export default function QuestionPostMain({ questionId }) {
  const dispatch = useDispatch();
  /**@type {import('../../../../../../types.ts').QuestionPostSelect[]} */
  const questionPosts = forAllParentsCallAddChildren(structuredClone(useSelector(selectQuestionPosts(questionId))), 'post_id');

  useEffect(() => {
    if ((questionId && !questionPosts) || (questionId && Array.isArray(questionPosts) && questionPosts.length === 0)) {
      dispatch(getQuestionPostsByQuestionId(questionId));
    }
  }, []);

  return (
    <div>
      {questionPosts.map((qpost) => {
        return (
          <QuestionPost
            id={qpost.id}
            key={qpost.id}
            post_id={qpost.post_id}
            username={qpost.username}
            user_id={qpost.created_by}
            icon={qpost.icon}
            text={qpost.text}
            updated_at={qpost.updated_at}
          ></QuestionPost>
        );
      })}
    </div>
  );
}
