import React, { useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      appDispatch({type: "saveRequestStarted"})
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token });
      console.log(response.data);

      if (response.data) {
        console.log(response.data)
        appDispatch({type: "saveRequestFinished"})
        // redirect to new post URL
        appDispatch({ type: "flashMessage", value: {type: "success", message: "New post created!" }});
        navigate(`/post/${response.data}`);
        // console.log("New post created")
      } else {
        // Display a flashmessage when the no content is submitted
        appDispatch({type: "flashMessage", value:{type: "danger", message: "Please provide content for the title and body"}})
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button disabled={appState.isSaving} className="btn save-btn">Save New Post</button>
      </form>
    </Page>
  );
}

export default CreatePost;
