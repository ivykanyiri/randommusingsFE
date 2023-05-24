import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";

function Followers() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchFollowers = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token });
        setFollowers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFollowers();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {followers.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        );
      })}

      {followers.length == 0 && appState.user.username == username && <div>You have no followers yet.</div>}

      {followers.length == 0 && appState.user.username != username && (
        <div>
          {username} does not have any followers yet.{" "}
          {appState.loggedIn && "Be the first to follow them."}
          {!appState.loggedIn && (
            <>
              {" "}
              If you want to follow them you need to <Link to="/">sign up</Link> for an account first.{" "}
            </>
          )}
        </div>

      )
      }
    </div>
  );
}

export default Followers;
