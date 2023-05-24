import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function Posts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.length ? (posts.map((post) => {
        return <Post hideAuthor={true} post={post} key={post._id} />;
      })) : <div>No posts to be displayed. </div> }
    </div>
  );
}

export default Posts;
