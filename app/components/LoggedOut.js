import React, { useState, useContext } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoggedOut() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [togglePassword, setTogglePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", { username, password });
      console.log(response.data);
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({ type: "flashMessage", value: "Welcome!" });
      } else {
        appDispatch({ type: "flashMessage", value: "Invalid username/password" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={(e) => setUsername(e.target.value)} name="username" className="form-control form-control-sm" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input className="form-control form-control-sm pass-input" type={togglePassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Password" />
          {/* <button className="btn loginpass-btn" onClick={togglePasswordVisibility}>
            {togglePassword ? <FaEyeSlash /> : <FaEye />}
          </button> */}
        </div>
        <div className="col-md-auto">
          <button className="signin-btn btn btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default LoggedOut;
