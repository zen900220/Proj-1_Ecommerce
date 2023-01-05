import React, { Fragment, useState } from "react";
import "./Search.css";
import MetaData from "../miscellaneous/MetaData";

const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  function searchSubmitHandler(e) {
    //cancels the default action of the event.
    //Default action of form submit is to submit
    //the data to an url tht processes the data.
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  }

  return (
    <Fragment>
      <MetaData title="SEARCH" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product..."
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
