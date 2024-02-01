//We will have to import these files to be able to make a button to login with Google
import { auth, provider } from "../Config/firebase";
import { signInWithPopup } from "firebase/auth"; //This opens up a popup with google sign in
import { useNavigate } from "react-router-dom"; //Allows us to redirect the user from one page to the other upon an action

import googleIcon from "../Images/googleIcon.png";

export const Login = () => {

    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            //signInWithPopup returns a promise, so lets use async await
            const signInResult = await signInWithPopup(auth, provider);  //The auth and provider are the things we imported from the firebase.ts config file
            /* console.log(signInResult); //Just testing to see what is signInResult. It seems to be an object */
        }
        catch (error) {
            console.error(error);
            return;
        }
        
        navigate("/"); 
        //The route that we will be re directed to.
    }

    return (
        <div className="login-page display-flex-column-c-c">
            <button onClick={signInWithGoogle} className="display-flex-c-c">
                <img src={googleIcon} alt="Google Logo" />
                <p>Sign in With Google</p>
            </button>
        </div>
    );
}