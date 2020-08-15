import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Column,
  Table,
  SortDirection,
  WindowScroller
} from "react-virtualized";
import _ from "lodash";
import { Checkbox } from "semantic-ui-react";
import "react-virtualized/styles.css"; // only needs to be imported once
import { FETCHING, SUCCESS, ERROR } from "./hooks/redux/actionTypes";
//import list from "./list";
import useApiRequest from "./hooks/redux";

export default function EditableList() {
  const [{ status, response }, makeRequest] = useApiRequest(
    `https://jsonplaceholder.typicode.com/photos`,
    {
      method: "get"
    }
  );

  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("ASC");

  const [sortedList, setSortedList] = useState(
    status === SUCCESS ? response : []
  );
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (status === SUCCESS) {
      setSortedList(response);
      //return sortedList;
    }
  }, [status, response]);

  // eslint-disable-next-line no-shadow
  function _sortList({ sortBy, sortDirection }) {
    const newList = _.sortBy(sortedList, [sortBy]);
    if (sortDirection === SortDirection.DESC) {
      newList.reverse();
    }
    return newList;
  }

  // eslint-disable-next-line no-shadow
  function _sort({ sortBy, sortDirection }) {
    setSortBy(sortBy);
    setSortDirection(sortDirection);
    setSortedList(_sortList({ sortBy, sortDirection }));
  }

  function _cellRenderer(dataKey, rowIndex) {
    if (dataKey === "title") {
      return (
        <>
          <div
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center"
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
              alignItems: "center"
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
  }

  const _onChangeHeaderCheckbox = (data) => {
    data.checked
      ? setChecked(sortedList && sortedList.map((row) => row.id))
      : setChecked([]);
  };

  const _onChangeRowCheckbox = (data) => {
    const newRow = sortedList && sortedList[data.index].id;
    checked.includes(newRow)
      ? setChecked((old) => old.filter((row) => row !== newRow))
      : setChecked((old) => [...old, newRow]);
  };

  return (
    <>
      <div styleName="editable-list">
        <button className="api-request__request-button" onClick={makeRequest}>
          Get User!
        </button>
        {status === FETCHING && <div>Fetching...</div>}
        {status === SUCCESS && (
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <Table
                autoHeight
                width={1000}
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                headerHeight={30}
                rowHeight={40}
                sort={_sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                rowCount={sortedList && sortedList.length}
                scrollTop={scrollTop}
                rowGetter={({ index }) => sortedList && sortedList[index]}
              >
                <Column
                  disableSort
                  dataKey="checkbox"
                  width={30}
                  headerRenderer={() => (
                    <Checkbox
                      indeterminate={
                        checked.length > 0 &&
                        checked.length < sortedList &&
                        sortedList.length
                      }
                      checked={
                        checked.length === sortedList && sortedList.length
                      }
                      onChange={(e, data) => _onChangeHeaderCheckbox(data)}
                    />
                  )}
                  cellRenderer={({ rowIndex }) => (
                    <Checkbox
                      checked={
                        checked.includes(
                          sortedList && sortedList[rowIndex].id
                        ) === true
                      }
                      onChange={(e, data) => _onChangeRowCheckbox(data)}
                      index={rowIndex}
                    />
                  )}
                />
                <Column
                  dataKey="id"
                  label="ID"
                  width={60}
                  cellRenderer={({ dataKey, rowIndex }) =>
                    _cellRenderer(dataKey, rowIndex)
                  }
                />
                <Column
                  dataKey="title"
                  label="Product"
                  width={140}
                  cellRenderer={({ dataKey, rowIndex }) =>
                    _cellRenderer(dataKey, rowIndex)
                  }
                />
                <Column
                  dataKey="inventory"
                  label="Inventory"
                  width={120}
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
                  width={150}
                  style={{ justifyContent: "space-evenly" }}
                  cellRenderer={({ dataKey, rowIndex }) =>
                    _cellRenderer(dataKey, rowIndex)
                  }
                />
              </Table>
            )}
          </WindowScroller>
        )}
        {status === ERROR && (
          <div>
            <br />
            <div>{JSON.stringify(sortedList)}</div>
          </div>
        )}
      </div>
    </>
  );
}

ReactDOM.render(<EditableList />, document.getElementById("root"));
