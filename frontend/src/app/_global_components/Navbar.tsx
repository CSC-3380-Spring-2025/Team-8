"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

    return (
        <nav>
          <div className="logo">
                <Link href={"/"}>
                    <img src="studyverselogo.png" alt={"Image representing Study Verse logo."}/>
                </Link>
          </div>
            <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open": ""}>
                 {isAuthenticated ? (
                    <>
                        <li>
                            <Link href="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/friends" className="nav-link">Friends</Link>
                        </li>
                        <li>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </li>
                        <li>
                            <Avatar alt="User Avatar" src="/user-avatar.png" />
                        </li>
                    </>
                    ) : (
                    <>
                        <li>
                            <Link href="/register" className="emphasized-btn">Sign Up</Link>
                        </li>
                        <li>
                            <Link href="/login" className="emphasized-btn">Login</Link>
                        </li>
                    </>
                    )}
            </ul>
        </nav>
    );
}

export default Navbar;

