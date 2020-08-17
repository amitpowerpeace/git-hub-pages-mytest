import React, { useState} from "react";
import {
  Column,
  Table,
  SortDirection,
  WindowScroller,
} from "react-virtualized";
import "react-virtualized/styles.css";
import _ from "lodash";
import CheckBox from "./CheckBox";
const ProductTable = (props) => {
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("ASC");

  const [sortedList, setSortedList] = useState(
    props.productTableData && props.productTableData
  );

  const [checked, setChecked] = useState([]);

  const sortList = ({ sortBy, sortDirection }) => {
    const newList = _.sortBy(sortedList, [sortBy]);
    if (sortDirection === SortDirection.DESC) {
      newList.reverse();
    }
    return newList;
  };

  // eslint-disable-next-line no-shadow
  const sort = ({ sortBy, sortDirection }) => {
    setSortBy(sortBy);
    setSortDirection(sortDirection);
    setSortedList(sortList({ sortBy, sortDirection }));
  };

  const _cellRenderer = (dataKey, rowIndex) => {
    if (dataKey === "title") {
      return (
        <>
          <div
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#66b3ff",
            }}
            index={rowIndex}
          >
            <img
              style={{ width: "30px", marginRight: "10px" }}
              alt="url"
              src={sortedList && sortedList[rowIndex]["url"]}
            />
            {sortedList && sortedList[rowIndex][dataKey]}
          </div>
        </>
      );
    } else if (dataKey === "inventory") {
      return (
        <>
          <div
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            index={rowIndex}
          >
            <span
              style={
                sortedList && sortedList[rowIndex]["instock"] === -1
                  ? { color: "#ff9933 " }
                  : {}
              }
            >
              {" "}
              {sortedList && sortedList[rowIndex]["instock"]}
            </span>
            <span style={{ marginLeft: "5px" }}>
              {sortedList && sortedList[rowIndex][dataKey]}
            </span>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            index={rowIndex}
            role="gridcell"
            style={dataKey === "status" ? { color: "green" } : {}}
          >
            {sortedList && sortedList[rowIndex][dataKey]}
          </div>
        </>
      );
    }
  };

  const onChangeHeaderCheckbox = (data) => {
    const { checked } = data.target;
    if (checked) {
      setChecked(sortedList && sortedList.map((row) => row.id));
    } else {
      setChecked([]);
    }
  };

  const onChangeRowCheckbox = (data, index) => {
    const newRow = sortedList && sortedList[index].id;
    checked.includes(newRow)
      ? setChecked((old) => old.filter((row) => row !== newRow))
      : setChecked((old) => [...old, newRow]);
  };

  const handleRowSelect = (e) => {
    const { index, rowData } = e;
    console.log(`${index} at the data ${rowData}`);
  };

  return (
    <div className="productTableContainer">
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <Table
            autoHeight
            width={1000}
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            headerHeight={30}
            onRowClick={(e) => handleRowSelect(e)}
            rowHeight={50}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            rowCount={Number(
              sortedList && sortedList.length > 0 && sortedList.length
            )}
            scrollTop={scrollTop}
            rowGetter={({ index }) => sortedList && sortedList[index]}
          >
            <Column
              disableSort
              dataKey="checkbox"
              width={50}
              headerRenderer={() => (
                <CheckBox
                  checked={checked.length === sortedList.length}
                  indeterminate={String(
                    checked.length > 0 &&
                      checked.length < sortedList &&
                      sortedList.length
                  )}
                  onChange={onChangeHeaderCheckbox}
                />
              )}
              cellRenderer={({ rowIndex }) => (
                <CheckBox
                  checked={
                    checked.includes(sortedList && sortedList[rowIndex].id) ===
                    true
                  }
                  onChange={(e) => onChangeRowCheckbox(e, rowIndex)}
                  index={rowIndex}
                />
              )}
            />
            <Column
              dataKey="id"
              label="ID"
              width={50}
              cellRenderer={({ dataKey, rowIndex }) =>
                _cellRenderer(dataKey, rowIndex)
              }
            />
            <Column
              dataKey="title"
              label="Product"
              width={400}
              cellRenderer={({ dataKey, rowIndex }) =>
                _cellRenderer(dataKey, rowIndex)
              }
            />
            <Column
              dataKey="inventory"
              label="Inventory"
              width={200}
              cellRenderer={({ dataKey, rowIndex }) =>
                _cellRenderer(dataKey, rowIndex)
              }
            />
            <Column
              dataKey="type"
              label="Type"
              width={200}
              cellRenderer={({ dataKey, rowIndex }) =>
                _cellRenderer(dataKey, rowIndex)
              }
            />
            <Column
              dataKey="vendor"
              label="Vendor"
              width={100}
              style={{ justifyContent: "space-evenly" }}
              cellRenderer={({ dataKey, rowIndex }) =>
                _cellRenderer(dataKey, rowIndex)
              }
            />
          </Table>
        )}
      </WindowScroller>
    </div>
  );
};

export default ProductTable;
