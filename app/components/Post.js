import React from "react";
import { Link } from "react-router-dom";

function Post({post, onClick, hideAuthor}) {
  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Link onClick={onClick} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> {""}
      <span className="text-muted small ">
        {!hideAuthor && <>by <strong>{post.author.username}</strong></>} on {dateFormatted}{" "}
      </span>
    </Link>
  );
}

export default Post;
