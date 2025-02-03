import { standardApiCall } from '@utils/api';
import { createSelector } from '@reduxjs/toolkit';
import { deepCopyArrayOfObjects } from 'maddox-js-funcs';
import { localImagesToBase64 } from '@utils/helperFuncs';

// Action Types
const SEND_MESSAGE = 'app/chatbot/SEND_MESSAGE';
const CLEAR_CHAT = 'app/chatbot/CLEAR_CHAT';

export function sendAiMessage(message, images = [], onComplete) {
  return async function (dispatch, getState) {
    const messages = selectMessages(getState()) ? deepCopyArrayOfObjects(selectMessages(getState())) : [];
    images = await localImagesToBase64(images);
    images = images.map((img) => ({ type: 'image_url', image_url: { url: img } }));
    images.length > 0
      ? messages.push({ role: 'user', content: [...images, { type: 'text', text: message }] })
      : messages.push({ role: 'user', content: [{ type: 'text', text: message }] });

    await standardApiCall('post', '/api/ai/chatbot/', { messages }, SEND_MESSAGE, {
      loadingComponent: 'ChatBot',
      fetchAction: { type: SEND_MESSAGE, payload: messages[messages.length - 1] },
    })(dispatch, getState);
    onComplete && onComplete();
  };
}

export function clearChat() {
  return { type: CLEAR_CHAT };
}

// Initial State
const DEFAULT_STATE = {
  messages: null,
};

// Reducer
export default function chatbotReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...(state.messages || []), action.payload],
      };
    case CLEAR_CHAT:
      return {
        ...state,
        messages: null,
      };
    default:
      return state;
  }
}

export const selectMessages = createSelector(
  (state) => state,
  (state) => state.app.chatbot.messages,
);
