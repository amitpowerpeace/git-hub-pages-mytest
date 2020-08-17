import React from "react";
import { FETCHING, SUCCESS, ERROR } from "../store/redux/actionTypes";
import useApiRequest from "../store/redux";

import ProductCard from "../components/ProductCard";

const ProductListContainer = (props) => {
  const API = "https://jsonplaceholder.typicode.com/photos";

  const [{ status, response }, makeRequest] = useApiRequest(API, {
    method: "get",
  });

  //The makePorductRequest which will be requesting 50000 mock data.just delete status === SUCCESS and replace responnse with arr
  let arr = [];
  const makeProductRequest = () => {
    for (var i = 0; i < 50000; i++) {
      let obj = {};
      obj = {
        id: i,
        title: "reprehenderit est deserunt velit ipsam",
        url: "https://via.placeholder.com/600/771796",
        instock: 25,
        inventory: "In Stock",
        type: "Gift Card",
        vendor: "Fullfil test store",
      };
      arr.push(obj);
    }
    return arr;
  };

  return (
    <div className="productListContainer">
      <button onClick={makeRequest}>Get Prodcuts!</button>

      {status === FETCHING && (
        <div>
          <p style={{ fontSize: "small" }}>Fetching Products...</p>
        </div>
      )}

      {status === SUCCESS && (
        <>
          <hr />
          <ProductCard productListData={response} />
        </>
      )}

      {status === ERROR && <div>{"Response Error"}</div>}
    </div>
  );
};

export default ProductListContainer;
