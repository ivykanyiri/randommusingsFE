import React from "react";
import Page from "./Page";

function Terms() {
  return (
    <Page title="Terms and Conditions">
      <h2>Our Terms &amp; Conditions</h2>
      <p className="lead text-muted">By using Random Musings, a website dedicated to sharing random thoughts about everyday experiences, you automatically agree to the Terms and Conditions outlined here. These Terms govern your access to and use of the services and information provided on the site. It is important to carefully read and understand these Terms, as well as the Privacy Policy, as your agreement to them is implied when you visit, view, access, or use any content or services on the site. </p>
      <h3>Details</h3>
      <ul className="text-muted">
        <li>In order to access specific functionalities of the Website/App, you are required to create an account and furnish personal information such as your chosen username, email address, and password. It is strictly prohibited to impersonate another individual or provide account details or an email address that does not belong to you. Your account must not be utilized for any unlawful or unauthorized activities.</li>
        <li>You are prohibited from uploading, posting, or sharing any artwork, photos, or other materials (referred to as "Materials") on the Site if they are protected by copyright, trademark, or other proprietary rights, unless you have obtained explicit written permission from the owner of those rights. It is your responsibility to ensure that the Materials you share are not protected by such rights. If you infringe upon copyrights, trademarks, or other proprietary rights or cause any harm through your submission, you will be held responsible for any resulting damages. By submitting Materials to the Site, you automatically declare that you have the authority to use and distribute them and that their use or display does not violate any laws, rules, regulations, or the rights of third parties</li>
        <li>To differentiate you from other website users, we utilize cookies and similar technologies. These cookies are small files containing letters and numbers that we store on your computer's hard drive or browser. The use of cookies enables us to enhance the website and provide a more superior and personalized service to our users.</li>
        <li>When you interact with our website, we may gather information that you provide to us. This includes instances such as registering for a user account, reporting any issues with the website, or signing up for email updates. Your personal information may be utilized to safeguard the security of your website usage, user account, and our overall business operations. It may also be employed to prevent or detect any instances of fraud or misuse of our services.</li>

      </ul>
    </Page>
  );
}

export default Terms;
