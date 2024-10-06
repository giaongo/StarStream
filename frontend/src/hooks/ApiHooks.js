import { baseUrl } from "../utils/variables";
import { logoutAndRemoveAdmin } from "../reducers/userReducer";

/**
 * Function to fetch data from backend
 * @param {*} url
 * @param {*} options
 * @param {*} navigate
 * @param {*} dispatch
 * @returns
 */
const doFetch = async (url, options, navigate, dispatch) => {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      navigate("/admin/login");
      dispatch(logoutAndRemoveAdmin());
    }
    throw new Error(json.msg);
  }
  return json;
};

/**
 * Custom hook for admin authentication functionalities
 * @param {*} navigate
 * @param {*} dispatch
 * @returns
 */
const useAuthentication = (navigate, dispatch) => {
  /**
   * login admin
   * @param {*} credentials
   * @returns
   */
  const loginAdmin = async (credentials) => {
    const options = {
      method: "POST",
      body: credentials,
    };
    try {
      const loginResult = await doFetch(
        `${baseUrl}/admin/login`,
        options,
        navigate,
        dispatch
      );
      return loginResult;
    } catch (error) {
      throw new Error(`loginAdminError: ${error.message}`);
    }
  };

  /**
   * Check token validity
   * @param {*} token
   * @returns
   */
  const checkToken = async (token) => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await doFetch(
        `${baseUrl}/admin/token`,
        options,
        navigate,
        dispatch
      );

      return result;
    } catch (error) {
      throw new Error(`checkTokenError: ${error.message}`);
    }
  };

  return { loginAdmin, checkToken };
};

/**
 * Custom hook for event functionalities
 * @param {*} navigate
 * @param {*} dispatch
 * @returns
 */
const useEvent = (navigate, dispatch) => {
  /**
   * Fetch all events for today
   * @param {*} token
   * @returns
   */
  const getEventToday = async (token) => {
    const options = {
      method: "GET",
    };

    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const events = await doFetch(
        `${baseUrl}/events/today`,
        options,
        navigate,
        dispatch
      );
      return events;
    } catch (error) {
      throw new Error(`getEventTodayError: ${error.message}`);
    }
  };

  /**
   * Add an event to database
   * @param {*} token
   * @param {*} data
   * @returns
   */
  const addEvent = async (token, data) => {
    const options = {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const result = await doFetch(
        `${baseUrl}/admin/event`,
        options,
        navigate,
        dispatch
      );
      return result;
    } catch (error) {
      throw new Error(`addEvent: ${error.message}`);
    }
  };

  /**
   * Delete event from database
   * @param {*} token
   * @param {*} id
   * @returns
   */
  const deleteEvent = async (token, id) => {
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const result = await doFetch(
        `${baseUrl}/admin/event/${id}`,
        options,
        navigate,
        dispatch
      );
      return result;
    } catch (error) {
      throw new Error(`deleteEvent: ${error.message}`);
    }
  };

  /**
   * Get viewing url for an event
   * @param {*} id
   * @returns
   */
  const getViewingUrl = async (id) => {
    try {
      const result = await doFetch(
        `${baseUrl}/events/viewing/${id}`,
        navigate,
        dispatch
      );
      return result;
    } catch (error) {
      throw new Error(`getViewingUrl: ${error.message}`);
    }
  };

  return { getEventToday, addEvent, deleteEvent, getViewingUrl };
};

/**
 * custom hook for video archive functionalities
 * @param {*} navigate
 * @param {*} dispatch
 * @returns
 */
const useVideo = (navigate, dispatch) => {
  /**
   * Fetch all video archives from backend
   * @returns
   */
  const getArchives = async () => {
    try {
      const result = await doFetch(
        `${baseUrl}/events/archives`,
        navigate,
        dispatch
      );
      return result;
    } catch (error) {
      throw new Error(`getArchives: ${error.message}`);
    }
  };
  return { getArchives };
};

export { useAuthentication, useEvent, useVideo };
