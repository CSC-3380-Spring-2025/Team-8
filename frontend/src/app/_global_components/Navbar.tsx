"use client";

import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav>
          <div className="logo">
              <img src="studyverselogo.png" alt={"Image representing Study Verse logo."}/>
          </div>
            <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open": ""}>
                {
                    <>
                        <li>
                            <a href="/register" className={"emphasized-btn"}>Sign Up</a>
                        </li>
                        <li>
                            <a href="/login"className={"emphasized-btn"}>Login</a>
                        </li>
                    </>
                }

            </ul>
        </nav>
    );
}

export default Navbar;

