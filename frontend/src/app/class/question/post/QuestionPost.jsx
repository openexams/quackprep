import { useEffect, useState } from 'react';
import { Comment } from 'semantic-ui-react';
import QuestionPostInput from './QuestionPostInput';
import { selectUser } from '@app/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { deleteQuestionPost } from './questionPostSlice';
export default function QuestionPost({ id, post_id, username, user_id, icon, text, updated_at, children, question_id, deleted }) {
  const [editMode, setEditMode] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const my_user_id = useSelector(selectUser).user?.id;
  const dispatch = useDispatch();
  if (text === null && deleted !== 1) {
    console.error('dev error, text is null but is not set deleted on local');
  }

  useEffect(() => {
    setEditMode(false);
    setReplyMode(false);
  }, [id, post_id, username, user_id, icon, text, updated_at, children, question_id]);

  return (
    <Comment key={`${id}_${text}`}>
      <Comment.Avatar src={icon} />
      <Comment.Content>
        <Comment.Author as='l'>{username}</Comment.Author>
        <Comment.Metadata>
          <div>{new Date(updated_at).toLocaleString()}</div>
        </Comment.Metadata>
        <Comment.Text>
          {editMode ? (
            <QuestionPostInput
              question_id={question_id}
              id={id}
              post_id={post_id}
              username={username}
              user_id={user_id}
              icon={icon}
              text={text}
              updated_at={updated_at}
            />
          ) : text ? (
            text
          ) : (
            <i style={{ color: 'gray', fontStyle: 'italic', opacity: 0.8 }}>this post has been deleted</i>
          )}
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action
            onClick={() => {
              setReplyMode(!replyMode);
              setEditMode(false);
            }}
          >
            Reply
          </Comment.Action>
          {my_user_id === user_id && deleted === 0 && (
            <>
              <Comment.Action
                onClick={() => {
                  setEditMode(!editMode);

                  setReplyMode(false);
                }}
              >
                Edit
              </Comment.Action>

              <Comment.Action
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this post?')) {
                    setEditMode(false);
                    setReplyMode(false);
                    if (id) {
                      dispatch(deleteQuestionPost(id));
                    } else {
                      console.error('how r u deleting without id');
                    }
                  }
                }}
              >
                Delete
              </Comment.Action>
            </>
          )}

          {replyMode && <QuestionPostInput question_id={question_id} post_id={id} parent_username={username} />}
        </Comment.Actions>
      </Comment.Content>
      <Comment.Group>{children}</Comment.Group>
    </Comment>
  );
}
