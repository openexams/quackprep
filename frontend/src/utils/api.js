import { show401Msg } from '@components/401/401Slice.js';
import axios from './axios.js';
import { hideFlashMessage, showFlashMessage } from '@components/flashmessage/flashMessageSlice.js';
import { startLoading, stopLoading } from '@src/app/store/loadingSlice.js';
import { signOut } from '@src/app/auth/login/loginSlice.js';
import { updateFetchHistory } from '@components/navbar/navbarSlice.js';
import { doesWordContainNavbarKeyword } from '@components/navbar/navbarFunctions.js';

/**
 * A redux thunk standard api call THIS IS BASICALLY A MIDDELWARE (idk how to make a real one yet) IF YOU ARE TALKING TO THE API PLS USE THIS
 * dispatches side affect actions such as loading, flash messages, adding the page to the fetch history
 *
 * @param {String} method get post put patch delete
 * @param {String} route where you wanna send data
 * @param {Object} [data] data you wanna send
 * @param {String} [requestAction] the constant you have in your reducer to do set loading
 * @param {String} resultAction the constant you have in your reducer to set the data
 * @param {String || Array} [componentName] the components name you want to load, will be added to the loadingComps state obj
 * @param {AxiosRequestConfig} [config] axios config to send the axios get
 * @param {String} [errorMsg] custom error message you want to show on screen if there an error
 * @param {String} [noticeOfSuccess] success message that the request was successfull.
 * @returns dispatches an action to the reducer with a action.payload of the data
 */
export function standardApiCall(
  method,
  route,
  data = null,
  resultAction,
  componentName = null,
  config = null,
  errorMsg = 'Server Error, servers may be down. Go to about and contact someone for help.',
  noticeOfSuccess = null,
  options,
) {
  return async function (dispatch, getState) {
    if ((options?.fetchHistory && options?.fetchHistory === true) || method === 'get') {
      const fetchHistory = getState().app.navbar.fetchHistory;
      if (fetchHistory[route] !== undefined) {
        // && doesWordContainNavbarKeyword(route)
        return; //"same get route hit twice!"
      }
      dispatch(updateFetchHistory(route));
    }

    dispatch(startLoading(componentName));
    try {
      let result = null;
      if (method === 'post' || method === 'put' || method === 'patch') {
        result = await axios[method.toLowerCase()](route, data, config);
      } else if (method === 'get' || method === 'delete') {
        result = await axios[method.toLowerCase()](route, config);
      } else {
        dispatch(showFlashMessage('axios method not found, this is a developer error. email support for help', 'err'));
        return;
      }
      if (resultAction) dispatch({ type: resultAction, payload: result.data });
      dispatch(hideFlashMessage());

      if (noticeOfSuccess) {
        dispatch(showFlashMessage(noticeOfSuccess, null));
      }
      dispatch(stopLoading(componentName));
      return result.data;
    } catch (error) {
      console.error(error);
      dispatch(stopLoading(componentName));
      console.error('Failed req to ', error.request.responseURL);
      if (error?.response?.data?.message?.includes('401')) {
        dispatch(signOut());
        dispatch(hideFlashMessage());
        dispatch(show401Msg());
      } else {
        dispatch(showFlashMessage('message:', error?.response?.data?.message || errorMsg || error.message));
      }
    }
  };
}
