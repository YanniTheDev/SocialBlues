import "../App.css"
import { Link } from "react-router-dom";
import { auth } from "../Config/firebase"; 
//The auth variable actually contains all the information about the user that just logged in

import { useAuthState } from "react-firebase-hooks/auth";

export const Navbar = () => {

    //This allows us to have access to the current auth user state
    const [user] = useAuthState(auth);
    //This is very much like useState, but for the user

    return (
        <nav className="navbar">
            <div className="navbar-contents">
                <Link to="/" className="margin-right-20px text-color-white text-size-30px"> Home </Link>

                {user && (
                    <Link to="/createpost" className="margin-right-20px text-color-white text-size-30px"> Create Post </Link>
                )}

                <div className="user-settings-nav">
                    {user ? (
                        <>
                            <Link to="/usersettings">
                                <img className="margin-right-20px text-color-white text-size-30px" src={user?.photoURL || ""} alt="User Profile Photo"/>
                            </Link>
                            {/* <button onClick={signUserOut}>Log Out</button> */}
                        </>
                    ) :
                    (
                        <Link to="/login" className="margin-right-20px text-color-white text-size-30px"> Login </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}