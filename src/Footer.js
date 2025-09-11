// Footer.js
import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="simple-footer">
            <p>© {new Date().getFullYear()} YourCompany. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
