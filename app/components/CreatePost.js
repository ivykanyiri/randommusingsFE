import React, { useState, useContext, useEffect } from "react";
import Page from "./Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const initialState = {
    title: {
      value: "",
      hasError: false,
    },
    body: {
      value: "",
      hasError: false,
    },
    submitCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "titleValue":
        (draft.title.hasError = false), (draft.title.value = action.value);
        return;
      case "bodyValue":
        (draft.body.hasError = false), (draft.body.value = action.value);
        return;
      case "submitForm":
        if (!draft.title.value.trim()) {
          draft.title.hasError = true;
        }

        if (!draft.body.value.trim()) {
          draft.body.hasError = true;
        }

        if (draft.title.value && draft.body.value) {
          draft.submitCount++;
        }
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  useEffect(() => {
    if (state.submitCount) {
      appDispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();

      const post = async () => {
        try {
          const response = await Axios.post("/create-post", { title: state.title.value, body: state.body.value, token: appState.user.token });
          console.log(response.data);

          if (response.data) {
            console.log(response.data);
            appDispatch({ type: "saveRequestFinished" });
            // redirect to new post URL
            appDispatch({ type: "flashMessage", value: { type: "success", message: "New post created!" } });
            navigate(`/post/${response.data}`);
            // console.log("New post created")
          } else {
            // Display a flashmessage when the no content is submitted
            appDispatch({ type: "flashMessage", value: { type: "danger", message: "Please provide content for the title and body" } });
          }
        } catch (error) {}
        console.log(error.message);
      };
      post();

      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type: "submitForm"})
    
  };

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => dispatch({ type: "titleValue", value: e.target.value })} autoFocus name="title" id="post-title" className={"form-control form-control-lg form-control-title " + (state.title.hasError ? "is-invalid" : "")} type="text" placeholder="" autoComplete="off" />
          
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => dispatch({ type: "bodyValue", value: e.target.value })} name="body" id="post-body" className={"body-content tall-textarea form-control " + (state.body.hasError ? "is-invalid" : "")} type="text"></textarea>
        </div>

        <button disabled={appState.isSaving} className="btn save-btn">
          Save New Post
        </button>
      </form>
    </Page>
  );
}

export default CreatePost;
