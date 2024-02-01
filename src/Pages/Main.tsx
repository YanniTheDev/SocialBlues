import "../App.css";

//Importing the libraries that we need to read the data from Firestore

//getDocs allows us to retrieve the documents that we need in the Firestore database
//collection simply allows us to specify which collection we are using
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { database } from "../Config/firebase";

import { useState, useEffect } from "react";
import { UserPost } from "../Components/UserPost";

import loading from "../Images/loading.png";

export interface UserPosts {
    id: string; //The reason why we added this id field here is because when we are retrieving each document, we will also
                //be having the document ID along with the contents of the document
    userID: string;
    title: string;
    description: string;
    username: string;
    unixTimeCreated: number;
}

export const Main = () => {
    const [usersPostsList, setUsersPostsList] = useState<UserPosts[] | null>(null);
    //What the useState<UserPosts[] | null>(null) means is that the state of usersPostsList will either be an array of type
    //UserPosts interface, or array

    //Referencing the collection
    const userPostsReference = collection(database, "userPosts");

    const [finishedLoadingPosts, setFinishedLoadingPosts] = useState<boolean>(false);

    const getUsersPosts = async () => {
        setFinishedLoadingPosts(false);

        const userPostsQuery = query(userPostsReference, orderBy("unixTimeCreated", "desc"));
        const data = await getDocs(userPostsQuery); //This will retrieve all the docs in our collection

        setUsersPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id})) as UserPosts[]);
        //The "as" keyword is saying that the object array we get back will be in the format of UserPosts interface arrays

        setFinishedLoadingPosts(true);
    }

    useEffect(() => {
        getUsersPosts();
    }, []) //When this component mounts (is being loaded/rendered/started) it will execute the getUsersPost function

    return (
        <section>
            {!finishedLoadingPosts && 
                <div className="loading-div display-flex-c-c">
                    <img src={loading} alt="loading" className="loading-wheel"/>
                </div>
            }

            <div className="user-posts">
                <div className="display-flex-column-c-c">
                    {usersPostsList?.map((post) => (
                        <UserPost post={post}/>
                    ))}
                </div>
            </div>
        </section>
    );
}