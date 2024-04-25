import React, { useEffect, useState } from 'react';
import LoginButton from './Login';
import LogoutButton from './Logout';
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userData,setUserData] = useState("");
  const [isDone,setIsDone] = useState(false);

  if(isAuthenticated && !isDone)
  {
    setUserData(user?.email || user?.name);
    setIsDone(true);
  }

  return (
    
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
        <a className="navbar-brand text-success fw-bold" href="/">Board</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
        </ul>
        <div className='d-flex gap-2'>
            {!isAuthenticated && (
              <LoginButton/>
            )}
            {isAuthenticated && (
              <div className='d-flex gap-2 justify-content-center align-items-center'>
                <h6 className='text-secondary'>{userData}</h6>
                <LogoutButton/>
              </div>
            )}
        </div>
        </div>
    </div>
    </nav>
  )
}

export default Header
