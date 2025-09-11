// If you're using the logo from src/assets
import React from "react";
// import { Link } from "react-router-dom"; // Only needed if you plan to use react-router-dom links
import "./Navbar.css"; // Make sure the CSS file is correctly linked
import logo from "./Icon.png"; // Assuming logo is in the same directory as Navbar.jsx. Adjust path if needed.

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-section left-section">
                {/* Logo moved to appear FIRST */}
                <div className="logo-container">
                    <img src={logo} alt="GlobalBPO Logo" className="logo-image" />
                </div>
                {/* Then the text */}
                <span className="navbar-text left-text">The Global BPO</span>
            </div>

            {/* This center-section is still empty for now */}
            <div className="navbar-section center-section">
                {/* Navigation links or other central content could go here */}
            </div>

            <div className="navbar-section right-section">
                <span className="navbar-text right-text">YOUR TRUSTED PARTNER IN GROWTH</span>
                {/* Any other right-aligned content like nav links */}
            </div>
        </nav>
    );
}

export default Navbar;