import React from "react";
import Page from "./Page";

function Contact() {
  return (
    <Page title="Contact Us">
      <h3 className="text-center mb-4">Get in Touch</h3>
      <p className="text-muted mb-5">Have questions or suggestions? We'd love to hear from you! Get in touch through our contact form below. We're here to assist you!</p>

      <div className="form-group text-muted">
        <form action="" method="post">
          <label htmlFor="name">Name:</label>
          <input className="form-control mb-4" type="text" id="name" name="name" required/>

          <label htmlFor="email">Email:</label>
          <input className="form-control mb-4" type="email" id="email" name="email" required/>

          <label htmlFor="message">Message:</label>
          <textarea className="form-control mb-4" name="message" id="message" required></textarea>

          <input className="save-btn btn" type="submit" value="Submit" />
        </form>
      </div>
    </Page>
  );
}

export default Contact;
