import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <Link to="/https://github.com/soumens7/MERN-E-Commerce-App">About Us</Link>
          <Link to="/">Careers</Link>
          <Link to="/">Press Releases</Link>
        </div>

        <div className="footer-col">
          <h4>Connect with Us</h4>
          <a href="https://facebook.com">Facebook</a>
          <a href="https://twitter.com">Twitter</a>
          <a href="https://instagram.com">Instagram</a>
        </div>

        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <Link to="/">Sell on MERN Mart</Link>
          <Link to="/">Affiliate Program</Link>
          <Link to="/">Advertise</Link>
        </div>

        <div className="footer-col">
          <h4>Let Us Help You</h4>
          <Link to="/">Your Account</Link>
          <Link to="/">Returns Centre</Link>
          <Link to="/">Help</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MERN Mart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
