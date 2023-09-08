import React, { useContext, useEffect } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Axios from "axios";
import { Link } from "react-router-dom";
import Post from "./Post";

function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: ourRequest.token });
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }
  return (
    <Page title="Home">
      {state.feed.length > 0 && (
        <>
          <h3 className="text-center mb-4">Home</h3>
          <div className="list-group mb-4">
            {state.feed.map((post) => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 class="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p class="text-muted text-center">The feed on your screen showcases the most recent posts from individuals you are following. To discover content from people who share similar interests, utilize the "Search" function located in the top menu bar. Once you find relevant content, you have the option to follow those individuals and stay up to date with their future posts.</p>
        </>
      )}
    </Page>
  );
}

export default Home;
