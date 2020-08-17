import React from "react";

const ProductSearch = (props) => {
  return (
    <div className="searchContainer">
      <select className="productFilter" id="filterProduct">
        <option value="filter">Filter</option>
      </select>

      <input type="text" className="searchTerm" placeholder="Search Products" />
      <i className="fa fa-search searchImg" style={{ fontSize: "12px" }}></i>
    </div>
  );
};

export default ProductSearch;
