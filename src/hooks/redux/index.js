import { useReducer, useCallback } from "react";
import reducer, { initialState } from "./reducer";
import { fetching, success, error } from "./actionCreators";

const useApiRequest = (endpoint, { method = "get", params = {} } = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const makeRequest = useCallback(async () => {
    dispatch(fetching());
    try {
      const res = await fetch(endpoint, params, {
        method: `${method}`
      });
      res.json().then((res) => dispatch(success(res)));
    } catch (e) {
      dispatch(error(e));
    }
  }, [endpoint, method, params]);

  return [state, makeRequest];
};

export default useApiRequest;
