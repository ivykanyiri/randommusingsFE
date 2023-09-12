import React, { useState, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";

function LoggedOut() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  // const [username, setUsername] = useState();
  // const [password, setPassword] = useState();
  const [togglePassword, setTogglePassword] = useState(false);

  //EDITS
  const initialState = {
    username: {
      value: "",
      hasError: false,
    },
    password: {
      value: "",
      hasError: false,
    },
    submitCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "usernameVal":
        draft.username.hasError = false;
        draft.username.value = action.value;
        return;
        
      case "passwordVal":
        draft.password.hasError = false;
        draft.password.value = action.value;
        return;
      
      case "submitForm":
        if (!draft.username.value.trim()) {
          draft.username.hasError = true;
        }

        if (!draft.password.value.trim()) {
          draft.password.hasError = true;
        }
        
        if (draft.username.value && draft.password.value) {
          draft.submitCount++;
        }
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.submitCount) {
      appDispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();
      const login = async () => {
        try {
          const response = await Axios.post("/login", { username: state.username.value, password: state.password.value });
          console.log(response.data);
          if (response.data) {
            appDispatch({type: "saveRequestFinished"})
            appDispatch({ type: "login", data: response.data });
            appDispatch({ type: "flashMessage", value: {type:"success", message:"Welcome!"}});
          } else {
            appDispatch({ type: "flashMessage", value: { type: "danger", message: "Invalid username/password"} });
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      login();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch({ type: "submitForm" });

  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
  
          <input name="username" onChange={e => dispatch({type: "usernameVal", value: e.target.value})}  className={"form-control form-control-sm " + (state.username.hasError ? "is-invalid" : "")} type="text" placeholder="Username" autoComplete="off" />
          
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input name="password" onChange = {e => dispatch({type: "passwordVal", value: e.target.value})}  className={"form-control form-control-sm " + (state.password.hasError ? "is-invalid" : "")}  type={togglePassword ? "text" : "password"} placeholder="Password" />
          
          
          {/* <button className="btn loginpass-btn" onClick={togglePasswordVisibility}>
            {togglePassword ? <FaEyeSlash /> : <FaEye />}
          </button> */}
        </div>
        <div className="col-md-auto">
          <button disabled={appState.isSaving} className="signin-btn btn btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default LoggedOut;
