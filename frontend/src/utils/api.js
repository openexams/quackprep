import { show401Msg } from '@components/401/401Slice.js';
import axios from './axios.js';
import { hideFlashMessage, showFlashMessage } from '@components/flashmessage/flashMessageSlice.js';
import { startLoading, stopLoading } from '@app/store/loadingSlice.js';
import { signOut } from '@app/auth/login/loginSlice.js';
import { updateFetchHistory } from '@app/layout/navbar/navbarSlice';
import { UNAUTHORIZED, RATE_LIMIT_EXCEEDED } from '../../../error_codes.js';

function handleApiError(error, dispatch) {
  const errorResponse = error.response?.data;

  switch (errorResponse?.errorCode) {
    case UNAUTHORIZED:
      dispatch(signOut());
      dispatch(show401Msg());
      return 'Your session has expired. Please login again.';

    case RATE_LIMIT_EXCEEDED: {
      const errorMessage = `Rate limit exceeded. Please try again ${
        error.response?.headers?.['retry-after'] ? 'in ' + error.response?.headers?.['retry-after'] + ' seconds' : 'later'
      }`;
      dispatch(showFlashMessage(errorMessage, true));
      return errorMessage;
    }

    default: {
      // all others can just be shown to the user.
      const errorMessage = errorResponse?.message || 'An unexpected error occurred';
      dispatch(showFlashMessage(errorMessage, true));
      return errorMessage;
    }
  }
}

/**
 * A redux thunk standard api call THIS IS BASICALLY A MIDDLEWARE (idk how to make a real one yet) IF YOU ARE TALKING TO THE API PLS USE THIS
 * dispatches side affect actions such as loading, flash messages, adding the page to the fetch history
 *
 * @param {String} method get post put patch delete
 * @param {String} route where you wanna send data
 * @param {Object} [data] data you wanna send
 * @param {string | string[]} resultAction the constant you have in your reducer to set the data afer its returned
 * @param {Object} [options] - Additional options for the request.
 * @param {string[]} [options.loadingComponent] - The name of the component to show while the request is in progress.
 * @param {Boolean} [options.fetchHistory] - Do you want to add fetch history to state
 * @param {import('axios').AxiosRequestConfig} [options.axiosConfig] - Axios Config
 * @param {String} [options.errorMsg] - error message to be seen by user
 * @param {String} [options.noticeOfSuccess] - if given, will show a flash message with this message
 * @param {String} [options.relocateOnCompletion] - if given, will have the client refresh to the page on completion
 * @param {Object} [options.fetchAction] - if given, will dispatch this action on call
 * @returns {Function} dispatches an action to the reducer with a action.payload of the data
 */
export function standardApiCall(method, route, data = null, resultAction, options) {
  return async function (dispatch, getState) {
    if (!dispatch || !getState) {
      console.error('standardApiCall: dispatch or getState is not defined');
      return;
    }
    if (options?.fetchAction) {
      dispatch(options.fetchAction); // example: { type: SEND_MESSAGE, payload: messages[messages.length - 1] }
    }

    if ((options?.fetchHistory && options?.fetchHistory === true) || method === 'get') {
      const fetchHistory = getState().app.navbar.fetchHistory;
      if (fetchHistory[route] !== undefined) {
        // && doesWordContainNavbarKeyword(route)
        return; //"same get route hit twice!"
      }
      dispatch(updateFetchHistory(route));
    }

    dispatch(startLoading(options?.loadingComponent));
    try {
      let result = null;
      if (method === 'post' || method === 'put' || method === 'patch') {
        result = await axios[method.toLowerCase()](route, data, options?.axiosConfig);
      } else if (method === 'get' || method === 'delete') {
        result = await axios[method.toLowerCase()](route, options?.axiosConfig);
      } else {
        dispatch(showFlashMessage('axios method not found, this is a developer error. email support for help', 'err'));
        return;
      }
      if (options?.relocateOnCompletion) {
        window.location.href = options.relocateOnCompletion;
        return;
      }
      if (Array.isArray(resultAction)) {
        for (let i = 0; i < resultAction.length; i++) {
          dispatch({ type: resultAction[i], payload: result.data });
        }
      } else if (resultAction) dispatch({ type: resultAction, payload: result.data });

      dispatch(hideFlashMessage());

      if (options?.noticeOfSuccess) {
        dispatch(showFlashMessage(options.noticeOfSuccess, null));
      }
      dispatch(stopLoading(options?.loadingComponent));
      return result.data;
    } catch (error) {
      console.error(error);
      const errorMessage = handleApiError(error, dispatch);
      console.error(errorMessage);

      dispatch(stopLoading(options?.loadingComponent));

      // if (options?.onError) {
      //   options.onError(error);
      // }
    }
  };
}
