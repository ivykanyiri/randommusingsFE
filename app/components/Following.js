import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";

function Following() {
  const appState = useContext(StateContext)
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchFollowing = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token });
        setFollowing(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFollowing();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {following.map((follow, index) => {
        return (
          <Link key={index} to={`/profile/${follow.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follow.avatar} />
            {follow.username}
          </Link>
        );
      })}

      {following.length == 0 && appState.user.username == username && <div>You are not following anyone yet.</div> }

      {following.length == 0 && appState.user.username != username && <div>{username} is not following anyone yet.</div> }

      
    </div>
  );
}

export default Following;
