import React, { useContext, useEffect } from "react";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import StateContext from "../StateContext";
import Posts from "./Posts";
import Followers from "./Followers";
import Following from "./Following";
import { useImmer, useImmerReducer } from "use-immer";

function Profile() {
  const appState = useContext(StateContext);

  const { username } = useParams();
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=234",
      counts: { postCount: "", followerCount: "", followingCount: "" },
      isFollowing: false,
    },
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
        setState((draft) => {
          draft.profileData = response.data;
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const ourRequest = Axios.CancelToken.source();

      const fetchData = async () => {
        try {
          const response = await Axios.post(`/addFolloW/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(error.message);
        }
      };

      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);


  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const ourRequest = Axios.CancelToken.source();

      const fetchData = async () => {
        try {
          const response = await Axios.post(`/removeFolloW/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(error.message);
        }
      };

      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  };

  const stopFollowing = () => {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  };

  

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername !== "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername !== "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      

      <Routes>
        <Route path= "" element={<Posts/>}/>
        <Route path= "followers" element={<Followers/>}/>
        <Route path= "following" element={<Following/>}/>
      </Routes>

    </Page>
  );
}

export default Profile;
