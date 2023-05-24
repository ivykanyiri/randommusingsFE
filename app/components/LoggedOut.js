import React, {useState, useContext} from "react";
import Axios  from "axios";
import DispatchContext from "../DispatchContext";


function LoggedOut() {
  const appDispatch = useContext(DispatchContext);


  const [username, setUsername] = useState()
  const [password, setPassword] = useState()



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios.post('/login', {username, password}) 
      console.log(response.data)
      if(response.data){
        appDispatch({ type : "login", data: response.data })
        appDispatch({type: "flashMessage", value: "Welcome!"})

      } else{
        appDispatch({type: "flashMessage", value: "Invalid username/password"})
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)}  name="password" className="form-control form-control-sm" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="signin-btn btn btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default LoggedOut;
