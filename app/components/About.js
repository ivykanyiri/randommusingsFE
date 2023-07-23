import React, { useContext, useState } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';


function About() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const initialState = {
    password: "",
    showPassword: false,
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case "setPassword":
        draft.password = action.value;
        return;
      case "toggleVisibility":
        draft.showPassword = !draft.showPassword;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const togglePassword = () => {
    dispatch({ type: "toggleVisibility" });
  };

  return (
    <Page title="About Us">
      <h2>About Us</h2>
      <p className="text-muted">Welcome to Random Musings, a vibrant platform where individuals can express their thoughts and experiences through personal blogging. Our website is designed to provide a space for users to share their day-to-day lives, allowing for a diverse range of stories and perspectives. Join our community and embark on a journey of self-expression as you chronicle your daily adventures and connect with like-minded individuals.</p>

      <input type={state.showPassword ? "text" : "password"} onChange={(e) => dispatch({ type: "setPassword", value: e.target.value })} placeholder="enter password" />
      <button onClick={togglePassword}>{state.showPassword ? <FaRegEyeSlash /> : <FaRegEye/> }</button>
    </Page>
  );
}

export default About;
