import { FETCHING, SUCCESS, ERROR } from "./actionTypes";

export const initialState = {
  status: null,
  response: null
};

const reducer = (state = initialState, { type, response, exception } = {}) => {
  switch (type) {
    case FETCHING:
      return { ...initialState, status: FETCHING };
    case SUCCESS:
      response =
        response &&
        response.map((item, index) => {
          let productInStock = 0;
          if (index === 1) {
            productInStock = 0;
          }
          if (index === 2) {
            productInStock = -1;
          } else {
            productInStock = 25;
          }
          return {
            id: item.id,
            title: item.title,
            url: item.url,
            instock: productInStock,
            inventory: "In Stock",
            type: "Gift Card",
            vendor: "Fullfil test store"
          };
        });
      return { ...state, status: SUCCESS, response };
    case ERROR:
      return { ...state, status: ERROR, response };
    default:
      return state;
  }
};

export default reducer;
