import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Ooops, we could not find that page.</h2>
        <p className="lead text-muted">
          Go back to <Link to="/">homepage.</Link>
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
