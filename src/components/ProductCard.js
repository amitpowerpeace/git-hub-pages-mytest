import React from "react";
import ProductTable from './shared/ProductTable'
import ProductSearch from './ProductSearch'
const ProductCard = (props) => {
  const productListData = props.productListData;
  return (
    <>
      <div className="productCardWrapper">
        <ProductSearch/>
        <p style={{fontSize:'small'}}>{productListData && productListData.length} Items count</p>
        <ProductTable productTableData={productListData}/>
      </div>
    </>
  );
};
export default ProductCard;
