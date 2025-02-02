import { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Segment, TextArea, Button, Icon, Message } from 'semantic-ui-react';
import { selectArrayOfStateById } from 'maddox-js-funcs';
import { selectNavbarState } from '@app/layout/navbar/navbarSlice';
import { selectUser } from '../auth/authSlice';
import LoginRequired from '../auth/LoginRequired';
import { selectLoadingState } from '@app/store/loadingSlice';
import TypingLoader from './TypingLoader/TypingLoader';
import './chatbot.css';
import { selectMessages, sendAiMessage } from './chatbotSlice';
import { useDispatch } from 'react-redux';
import logo from '/img/quackprep_logo.webp';

export default function ChatBot() {
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectLoadingState).loadingComps?.ChatBot;
  const user_id = useSelector(selectUser).user?.id;
  const { questionId } = useSelector(selectNavbarState).navbar;

  const currentQuestion = useSelector(selectArrayOfStateById('app.question.questions', 'id', questionId))?.[0];
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  function removeCurrentlyWorkingOn(message) {
    return message.replace(/currently-working-on:".*?"/g, '');
  }

  const scrollToBottom = () => {
    const messagesWrapper = messagesEndRef.current?.closest('.messages-wrapper');
    if (messagesWrapper) {
      // scrollHeight represents total scrollable height of content (including overflow)
      // scrollTop represents pixels scrolled from the top
      // Setting scrollTop = scrollHeight forces scroll position to bottom because
      // we're scrolling down by the maximum possible amount
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      dispatch(
        sendAiMessage(
          `${currentQuestion?.question ? `currently-working-on:"${currentQuestion?.question}"` : ''}${inputValue}`,
          () => setTimeout(() => scrollToBottom(), 100), // wait for state to update "hackish"
        ),
      );
      setInputValue('');
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  if (!user_id) return <LoginRequired title='QuackPrepGPT' />;

  return (
    <Segment className='chat-container' style={{ width: '20rem', height: '35rem' }}>
      <div className='messages-wrapper'>
        {
          <div className='message-bubble assistant-message'>
            <div className='message-text'>
              {currentQuestion
                ? `Ask me anything about "${currentQuestion?.question?.slice(0, 50)} ..."`
                : "Hello! I'm QuackPrepGPT🦆. How can I help you today?"}
            </div>
          </div>
        }
        {messages &&
          messages.map((message, index) => (
            <div key={index} className={`message-bubble ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              <div className='message-text'>{removeCurrentlyWorkingOn(message.content)}</div>
            </div>
          ))}
        {loading && <TypingLoader />}
        <div ref={messagesEndRef} />
      </div>

      <div className='input-section'>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Type here...'
          rows={1}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          className='chat-textarea'
          disabled={loading}
        />
        <Button
          id='send-ai-prompt'
          name='send'
          color='blue'
          onClick={handleSubmit}
          disabled={!inputValue.trim() || loading}
          className='send-button'
        >
          <Icon name='send' />
        </Button>
      </div>
    </Segment>
  );
}
