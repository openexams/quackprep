import { show401Msg } from '@components/401/401Slice.js';
import axios from './axios.js';
import { hideFlashMessage, showFlashMessage } from '@components/flashmessage/flashMessageSlice.js';
import { startLoading, stopLoading } from '@src/app/store/loadingSlice.js';
import { signOut } from '@src/app/auth/login/loginSlice.js';

/**
 * A redux thunk standard api call
 *
 * @param {String} method get post put patch delete
 * @param {String} route where you wanna send data
 * @param {Object} [data] data you wanna send
 * @param {String} [requestAction] the constant you have in your redu cer to do set loading
 * @param {String} resultAction the constant you have in your reducer to set the data
 * @param {String} [componentName] the components name you want to load, will be added to the loadingComps state obj
 * @param {AxiosRequestConfig} [config] axios config to send the axios get
 * @param {String} [errorMsg] custom error message you want to show on screen if there an error
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
) {
  return async function (dispatch) {
    if (componentName !== null) dispatch(startLoading(componentName));
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
