import { baseUrl } from "../utils/variables";
import { logoutAndRemoveAdmin } from "../reducers/userReducer";

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

const useAuthentication = (navigate, dispatch) => {
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

const useEvent = (navigate, dispatch) => {
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
export { useAuthentication, useEvent };
