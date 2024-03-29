import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function HomeGuest() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const [togglePassword, setTogglePassword] = useState(false);

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      errorMessage: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      errorMessage: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      errorMessage: "",
    },
    showPassword: false,
    submitCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.errorMessage = "Username cannot exceed 30 characters";
        }

        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true;
          draft.username.errorMessage = "Username can only contain alphanumerics.";
        }
        return;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.errorMessage = "Username must be atleast 3 characters.";
        }

        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.errorMessage = "That username is already in use.";
        } else {
          draft.username.isUnique = true;
        }
        return;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.errorMessage = "Please provide a valid email address";
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }

        return;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.errorMessage = "That email address is already in use.";
        } else {
          draft.email.isUnique = true;
        }
        return;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.errorMessage = "Password should not exceed 50 characters.";
        }
        return;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.errorMessage = "Password must be atleast 12 characters.";
        }
        return;
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "usernameAfterDelay" });
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "emailAfterDelay" });
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "passwordAfterDelay" });
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token });
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const response = await Axios.post("/doesemailExist", { email: state.email.value }, { cancelToken: ourRequest.token });
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      appDispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token });
          appDispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "login", data: response.data });
          appDispatch({ type: "flashMessage", value: "Successfully created account. Welcome!" });
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  };

  return (
    <Page title="Welcome" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Daily Musings</h1>
          <p className="lead text-muted">Welcome to Random Musings, an energetic platform for personal blogging. Share thoughts and experiences, connect with like-minded individuals, and chronicle daily adventures in our diverse community. Join now and express yourself freely!</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={(e) => dispatch({ type: "usernameImmediately", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.errorMessage}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={(e) => dispatch({ type: "emailImmediately", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />

              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.errorMessage}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input type={togglePassword ? "text" : "password"} onChange={(e) => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control pass-input" placeholder="Create a password" />
              <button type="button" className="btn pass-btn" onClick={togglePasswordVisibility}>
                {togglePassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </button>

              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.errorMessage}</div>
              </CSSTransition>
            </div>
            <button disabled={appState.isSaving} type="submit" className="signup-btn py-3 mt-4 btn btn-lg btn-block">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
