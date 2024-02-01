import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../Config/firebase";

import { useNavigate } from "react-router-dom";
import { QuerySnapshot, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { UserPosts } from "./Main";
import { UserPost } from "../Components/UserPost";

import loading from "../Images/loading.png";

export const UserSettings = () => {

    const navigate = useNavigate();

    const userPostsReference = collection(database, "userPosts");

    //This allows us to have access to the current auth user state
    const [user] = useAuthState(auth);
    //This is very much like useState, but for the user

    useEffect (() => {
        const authListener = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                getThisUserPosts();
            }
            else {
                console.error("User is null");
            }
        })

        return () => {
            authListener();
        }   
    }, [user]);


    const [thisUserPostsNumber, setThisUserPostsNumber] = useState<number>(0);
    const [thisUserPostsList, setThisUserPostsList] = useState<UserPosts[] | null>([]);

    const [finishedLoading, setFinishedLoading] = useState(false);
    
    const getThisUserPosts = async () => {
        try {
            setFinishedLoading(false);

            const userPostsQuery = query(userPostsReference, where("userID", "==", user?.uid), orderBy("unixTimeCreated", "desc"));
            const thisUserPosts = await getDocs(userPostsQuery);

            getThisUserPostsAmount(thisUserPosts);
            setThisUserPostsList(thisUserPosts.docs.map((doc) => ({...doc.data(), id: doc.id})) as UserPosts[])

            setFinishedLoading(true);
        }
        catch (error) {
            console.error(error);
        }
    }

    const getThisUserPostsAmount = (thisUserPosts:QuerySnapshot) => {
        setThisUserPostsNumber(thisUserPosts.docs.length);
    }
 
    const signUserOut = async () => {
        await signOut(auth); //Signing the user out
        navigate("/");
    }
    
    return (
        <section>
            {finishedLoading ? (
                <main className="user-settings">
                    <section className="user-settings-banner display-flex-c-c">
                        <img src={user?.photoURL || ""} alt="User Profile Picture" />
                        <h1>Posts: {thisUserPostsNumber}</h1>
                        <button onClick={signUserOut}><b>Logout</b></button>
                    </section>
                    <section className="user-posts">
                        <div className="display-flex-column-c-c">
                            {
                                thisUserPostsList?.map((post) => (
                                    <UserPost post={post}/>
                                ))
                            }
                        </div>
                    </section>
                </main>
            ) :
            (
                <section className="loading-div display-flex-c-c">
                    <img src={loading} alt="Loading spinner" className="loading-wheel"/>
                </section>
            )}
        </section>
    );
}