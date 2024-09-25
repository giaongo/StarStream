import { baseUrl } from "../utils/variables";
import { useNavigate } from "react-router-dom";

const doFetch = async (url, options, navigate) => {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      navigate("/admin/login");
    }
    throw new Error(json.msg);
  }
  return json;
};

const useAuthentication = () => {
  const navigate = useNavigate();
  const loginAdmin = async (credentials) => {
    const options = {
      method: "POST",
      body: credentials,
    };
    try {
      const loginResult = await doFetch(
        `${baseUrl}/admin/login`,
        options,
        navigate
      );
      return loginResult;
    } catch (error) {
      throw new Error(`loginAdminError: ${error.message}`);
    }
  };

  return { loginAdmin };
};

const useEvent = () => {
  const navigate = useNavigate();

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
        navigate
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
      const result = await doFetch(`${baseUrl}/admin/event`, options, navigate);
      return result;
    } catch (error) {
      throw new Error(`addEvent: ${error.message}`);
    }
  };

  return { getEventToday, addEvent };
};
export { useAuthentication, useEvent };
