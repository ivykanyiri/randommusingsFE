import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";
import StateContext from "../StateContext";

const Header = ({ loggedIn, staticEmpty }) => {
  const appState = useContext(StateContext);
  const headerContent = appState.loggedIn ? <LoggedIn /> : <LoggedOut />;

  return (
    <header className="header-bar mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="header-logo">
            Random Musings
          </Link>
        </h4>
        {!staticEmpty ? headerContent : ""}
      </div>
    </header>
  );
};

export default Header;
