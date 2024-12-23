import { useSelector } from 'react-redux';
import { Segment, TextArea, Button } from 'semantic-ui-react';
import { selectArrayOfStateById } from 'maddox-js-funcs';
import { selectNavbarState } from '@components/navbar/navbarSlice';
import { selectUser } from '../auth/authSlice';
import LoginRequired from '../auth/LoginRequired';

export default function PopupChild() {
  const user = useSelector(selectUser).user;
  // finds current question based on the id present in the navbar state ->
  const { questionId } = useSelector(selectNavbarState).navbar;
  const currentQuestion = useSelector(selectArrayOfStateById('app.question.questions', 'id', questionId))?.[0];

  function handleCopyClick() {
    navigator.clipboard.writeText(currentQuestion?.question);
  }

  return (
    <Segment
      basic
      style={{
        minHeight: '20rem',
        minWidth: '15rem',
        borderRadius: '20px',
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '1rem',
        lineHeight: '1.5',
      }}
    >
      {user?.id ? (
        <>
          <div
            style={{
              backgroundColor: '#d9f9d9',
              borderRadius: '15px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'inline-block',
              boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p style={{ margin: 0, fontWeight: 'bold', color: '#2d6a4f' }}>Hi, I'm QuackPrepGPT! 🦆</p>
            <p style={{ margin: '0.5rem 0' }}>I'm here to help you with your questions! Your current question prompt is:</p>
          </div>
          <TextArea
            value={currentQuestion?.question || 'Cant Find your Current Question'}
            style={{
              width: '100%',
              marginBottom: '1rem',
              borderRadius: '8px',
              borderColor: '#ccc',
              backgroundColor: '#fff',
              padding: '0.5rem',
            }}
            readOnly
          />
          <Button
            size='tiny'
            onClick={handleCopyClick}
            style={{
              backgroundColor: '#2d6a4f',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            Copy
          </Button>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              Please copy this and go to{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://chatgpt.com/g/g-674e1790908c8191bdc671fce1119c1a-quackprepgpt'
                style={{
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                quackprepgpt
              </a>{' '}
              then paste it.
            </p>
          </div>
        </>
      ) : (
        <LoginRequired title={'Quackprepgpt'} />
      )}
    </Segment>
  );
}
