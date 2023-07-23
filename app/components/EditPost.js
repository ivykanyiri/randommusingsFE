import React, { useState, useEffect, useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const navigate = useNavigate();

  const initialState = {
    title: {
      value: "",
      hasError: false,
      errMessage: "",
    },
    body: {
      value: "",
      hasError: false,
      errMessage: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleEdits":
        draft.title.hasError = false;
        draft.title.value = action.value;
        return;
      case "bodyEdits":
        draft.body.hasError = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.errMessage = "Please provide a title.";
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.errMessage = "Please provide body content.";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
        if (response.data) {
          console.log(response.data)
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username !== response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You don't have permission to edit this post" });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      appDispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();

      const sendPost = async () => {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token });
          appDispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was updated." });
          navigate(`/post/${state.id}`);

        } catch (error) {
          console.log(error.message);
        }
      };
      sendPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        {" "}
        &laquo; Back to post
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "titleRules", value: e.target.value })} onChange={(e) => dispatch({ type: "titleEdits", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.errMessage}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "bodyRules", value: e.target.value })} onChange={(e) => dispatch({ type: "bodyEdits", value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.errMessage}</div>}
        </div>
        <button className="btn save-btn" disabled={appState.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
