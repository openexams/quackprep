import { useState } from 'react';
import { Comment } from 'semantic-ui-react';
import QuestionPostInput from './QuestionPostInput';
export default function QuestionPost({ id, post_id, username, user_id, icon, text, updated_at, children }) {
  const [editMode, setEditMode] = useState(false);
  const [replyMode, setReplyMode] = useState(false);

  return (
    <Comment key={id}>
      <Comment.Avatar src={icon} />
      <Comment.Content>
        <Comment.Author as='l'>{username}</Comment.Author>
        <Comment.Metadata>
          <div>{new Date(updated_at).toLocaleString()}</div>
        </Comment.Metadata>
        <Comment.Text>
          {editMode ? (
            <QuestionPostInput
              id={id}
              post_id={post_id}
              username={username}
              user_id={user_id}
              icon={icon}
              text={text}
              updated_at={updated_at}
            />
          ) : (
            text
          )}
        </Comment.Text>
        <Comment.Actions>
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
              setReplyMode(!replyMode);
              setEditMode(false);
            }}
          >
            Reply
          </Comment.Action>
          {replyMode && <QuestionPostInput post_id={id} parent_username={username} />}
        </Comment.Actions>
      </Comment.Content>
      <Comment.Group>{children}</Comment.Group>
    </Comment>
  );
}
