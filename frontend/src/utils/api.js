import { show401Msg } from '@components/401/401Slice.js';
import axios from './axios.js';
import { hideFlashMessage, showFlashMessage } from '@components/flashmessage/flashMessageSlice.js';
import { startLoading, stopLoading } from '@src/app/store/loadingSlice.js';
import { signOut } from '@src/app/auth/login/loginSlice.js';
import { updateFetchHistory } from '@components/navbar/navbarSlice.js';

/**
 * A redux thunk standard api call
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
) {
  return async function (dispatch, getState) {
    // new function to figure out what was actually fetched, as it may not hit what the x amt of items it needed to fetch before this value updates
    const pageFetched = getState()?.app?.navbar?.page; // this is not delayed and gets called the second the user clicks it
    if (Array.isArray(componentName)) {
      for (let i = 0; i < componentName.length; i++) {
        dispatch(startLoading(componentName[i]));
      }
    } else if (componentName !== null) dispatch(startLoading(componentName));
    try {
      let result = null;
      if (method === 'post' || method === 'put' || method === 'patch') {
        result = await axios[method.toLowerCase()](route, data, config);
      } else if (method === 'get' || method === 'delete') {
        result = await axios[method.toLowerCase()](route, config);
      } else {
        dispatch(showFlashMessage('axios function not found', 'err'));
        return;
      }
      if (resultAction) dispatch({ type: resultAction, payload: result.data });
      dispatch(hideFlashMessage());
      dispatch(updateFetchHistory(pageFetched));
      if (noticeOfSuccess) {
        dispatch(showFlashMessage(noticeOfSuccess, null));
      }
      dispatch(stopLoading(componentName));
    } catch (error) {
      console.error(error);
      dispatch(stopLoading(componentName));
      console.error('Failed req to ', error.request.responseURL);
      if (error?.response?.data?.message?.includes('401')) {
        dispatch(signOut());
        dispatch(show401Msg());
        dispatch(hideFlashMessage());
      } else {
        dispatch(showFlashMessage('Error', error?.response?.data?.message || errorMsg || error.message));
      }
    }
  };
}
