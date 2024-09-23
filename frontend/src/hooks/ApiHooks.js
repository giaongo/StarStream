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

export { useAuthentication };
