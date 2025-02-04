import { sleep } from "./helpers.js";
import axios from "axios";

// Set the base URL for all requests
axios.defaults.baseURL = "https://api.boilerexams.com";

// Set headers to mimic a web browser
axios.defaults.headers.common["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
axios.defaults.headers.common["Accept"] =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
axios.defaults.headers.common["Accept-Language"] = "en-US,en;q=0.5";

/**
 *
 * @param {String} url
 * @param {Number} retries
 * @param {Number} delay in ms
 * @returns {any}
 */
export async function fetchWithExponetialBackoff(
  url,
  retries = 5,
  delay = 5000
) {
  try {
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    if (retries > 0) {
      const delayTime = delay * 2 ** (5 - retries); // 1 on init call
      console.log(`retrying in ${delayTime}`);
      await sleep(delayTime);
      return fetchWithExponetialBackoff(url, retries - 1, delay); //If you return a promise (like the result of another async function), the async function will wait for that promise to resolve and then return its resolved value.
    } else {
      console.log("failed after many retires", error);
      throw error;
    }
  }
}

export default axios;
