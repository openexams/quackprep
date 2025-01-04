import { useEffect, useState } from 'react';
import { List, Icon, Modal, Button, Label, Segment, Dropdown } from 'semantic-ui-react';
import { generateQuestionLike } from './aiQuestionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import LoginRequired from '@src/app/auth/LoginRequired';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { selectNavbarState } from '@components/navbar/navbarSlice';
import { selectArrayOfStateByGroupId } from '@utils/helperFuncs';

export default function GenerateQuestion() {
  const { groupId } = useSelector(selectNavbarState).navbar;
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector(selectUser).user;
  const loading = useSelector(selectLoadingState).loadingComps?.GenerateQuestion;
  const questions = useSelector(selectArrayOfStateByGroupId('app.question.questions', groupId));

  const [dropdownQuestion, setDropdownQuestion] = useState(null);

  const q_options = [];
  for (let i = 0; i < questions.length; i++) {
    q_options.push({ key: questions[i].id, value: questions[i], text: `${questions[i].id}: ${questions[i].question}` });
  }

  return (
    <>
      <List.Item onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
        <List.Header as='h4' style={{ margin: 0, display: 'flex' }}>
          Generate New Question 🤖 <Label size='mini' color='blue' content={'AI'} />
        </List.Header>
      </List.Item>

      <Modal closeIcon open={isOpen} onClose={() => setIsOpen(false)} size='small' centered={false}>
        {!user?.id ? (
          <LoginRequired title={'Generative AI'} />
        ) : (
          <>
            <Modal.Header>Generate a Similar Question</Modal.Header>
            <Modal.Content>
              <Dropdown
                loading={loading}
                onChange={(e, d) => setDropdownQuestion(d.value)}
                value={dropdownQuestion}
                clearable
                closeOnEscape
                placeholder='Provide an example question to help the AI generate similar ones.'
                fluid
                search
                selection
                options={q_options}
              />
              <Segment basic loading={loading}>
                Click "Generate" to create a new question similar to the one you just answered. This will help improve your
                learning experience! (It takes about <strong>10 seconds</strong> to generate a question){' '}
                {/*  could have it count down or smth would be cool or let user know somehow, would have to turn off auto close too though*/}
              </Segment>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setIsOpen(false)} color='red'>
                <Icon name='cancel' /> {!loading ? 'Cancel' : 'Close'}
              </Button>
              {!loading && (
                <Button
                  onClick={() => {
                    if (dropdownQuestion && dropdownQuestion.id && dropdownQuestion.question) {
                      dispatch(generateQuestionLike(dropdownQuestion.id, dropdownQuestion.question));
                      setIsOpen(false);
                    } else {
                      window.alert('please select a question for use of generation');
                    }
                  }}
                  color='green'
                >
                  <Icon name='checkmark' /> Generate
                </Button>
              )}
            </Modal.Actions>
          </>
        )}
      </Modal>
    </>
  );
}
