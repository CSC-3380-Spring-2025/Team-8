"use client";

import Link from "next/link";
import React, {useState, useEffect} from "react";
import {Avatar, IconButton, Menu, MenuItem} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import {useRouter} from "next/navigation";
import useWindowDimensions from "@/app/custom_hooks/window_dimensions";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (e: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget);
  }

  const handleClose = () => {
      setAnchorEl(null);
  }

  const handleSignOut = () => {
      localStorage.removeItem("authToken");

      if (!localStorage.getItem("authToken")) {
          router.push("/");
      }
  }

  const handleProfileClick = () => {
      router.push("/profile");
  }


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
                            <Link href="/friends" className="nav-link">
                                {width >= 600 ? <GroupIcon/> : "Friends"}
                            </Link>
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
            {isAuthenticated ? (
                <div id={"userIconNav"}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                    </Menu>
                </div>
            ) : (
                <></>
            )}
        </nav>
    );
}

export default Navbar;

