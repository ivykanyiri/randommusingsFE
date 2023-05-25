import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
// import { Tooltip } from "react-tooltip";

function LoggedIn() {
  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleLogout = () => {
    appDispatch({ type: "logout" });
    appDispatch({type: "flashMessage", value: "Signed out."})
    navigate('/')

  };

  const handleSearchIcon = (e) => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      
      {/* <Tooltip place="bottom" id="search" className="custom-tooltip" /> */}{" "}
      <span onClick={() => appDispatch({ type: "toggleChat" })} className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "chat-icon")}>
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white"> {appState.unreadChatCount < 10 ? appState.unreadChatCount: '9+'}</span> : ""}
      </span>{" "}
      
      <Link className="create-post-btn btn btn-sm" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className=" signout-btn btn btn-sm">
        Sign Out
      </button>{" "}
      <a data-tooltip-id="search" data-tooltip-content="Search" onClick={handleSearchIcon} href="#" className="mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>{" "}
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
    </div>
  );
}

export default LoggedIn;
