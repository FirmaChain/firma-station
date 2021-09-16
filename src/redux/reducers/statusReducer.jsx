import { handleActions } from "redux-actions";

const SET_FOOTER = "status/SET_FOOTER";

const initialState = {
  footer: [],
};

export default handleActions(
  {
    [SET_FOOTER]: (state, { footer }) => {
      return {
        ...state,
        footer,
      };
    },
  },
  initialState
);
