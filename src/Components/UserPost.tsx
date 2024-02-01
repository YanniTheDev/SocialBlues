import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
//"query" allows us to specify what we want to get from our collection. This allows us to specify which documents we want to get
//In this case, we want to retrieve the document that has the same postID as the id that is attached to the post
//So that we can correctly display the number of likes
//The "where" is similar to the where keyword in MySQL language. It is basically the equivalent of an if statement
import { auth, database } from "../Config/firebase";
import { UserPosts } from "../Pages/Main";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

import likeButton from "../Images/thumbup.png";
import dislikeButton from "../Images/thumbdown.png";

interface Props {
    post: UserPosts; //We are saying that the post field contain the format of UserPosts interface
}

interface PostLike {
    postID: string;
    userID: string;
}

export const UserPost = (props: Props) => {
    const { post } = props; //Destructuring the props that we get passed
    
    const userPostsLikesReference = collection(database, "userPostLikes"); //Referencing userPostLikes collection
    const [user] = useAuthState(auth);

    const likesDocument = query(userPostsLikesReference, where("postID", "==", post.id))
    //What the "where" function does is to allow us to specify what document to get based on the conditions we pass
    //In this case, the condition we pass is that the postID of the post has to be the same post.id we have, so meaning that we
    //have matching posts. This allows us to display the correct number of likes for each post


    const [userPostLikes, setUserPostLikes] = useState<PostLike[] | null>(null); //State for the number of likes a post has

    const getPostLikes = async () => {
        const likesData = await getDocs(likesDocument);

        setUserPostLikes(likesData.docs.map((doc) => (
            {userID: doc.data().userID, postID: doc.id}
        )));
        //Basically this is containing all the information about the users that liked the post
    }

    useEffect(() => {
        getPostLikes(); //Retrieving the number of likes whenever this component mounts
    }, [])

    const incrementPostLikes = async () => {
        try {
            const newDocument = await addDoc(userPostsLikesReference, {
                userID: user?.uid,
                postID: post.id
            });

            //If user is not null, therefore logged in, then will execute the stuff
            if (user) {
                setUserPostLikes((previousState) => 
                    previousState ? [...previousState, {userID: user?.uid, postID: newDocument.id}] : [{userID: user?.uid, postID: newDocument.id}]
                );
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const decrementPostLikes = async () => {
        //We will want to be able to delete a like if the document's postID is the same as the postID in this component
        //and the userID is the same as the current userID 
        const findLikeDocuments = query(
            userPostsLikesReference,
            where("postID", "==", post.id),
            where("userID", "==", user?.uid)
        );

        const getLikeDocuments = await getDocs(findLikeDocuments);

        //"doc" is used to specify which document to delete. The last argument is the id of the document we want to delete.
        const likeDocumentToDelete = doc(database, "userPostLikes", getLikeDocuments.docs[0].id);

        await deleteDoc(likeDocumentToDelete); //Deletes the document, therefore decreasing the number of likes

        if (user) {
            setUserPostLikes((previousState) => 
                previousState && previousState.filter((post) => post.postID !== getLikeDocuments.docs[0].id)
            );
        }
    }

    const hasUserLiked = userPostLikes?.find((like) => like.userID === user?.uid)
    //What the above line of code does is that it loops over the list (find method) and checks if the like.userID is the same
    //as the ID as the user that is currently logged in. If it is, then the boolean of hasUserLiked is set to true

    return (
        <section className="user-post display-flex-column-s-s">
            <div className="user-post-title text-color-white">
                <h1>{post.title}</h1>
            </div>
            <div className="user-post-description text-color-white">
                <p>{post.description}</p>
            </div>

            <div className="user-post-info text-color-white display-flex-c-c">
                <p>@{post.username}</p>
                <button onClick={hasUserLiked ? decrementPostLikes : incrementPostLikes}>
                    <img src={hasUserLiked ? dislikeButton : likeButton} alt="Like button"/>
                </button>
                {/* This means that if the user has liked, then they can only dislike the post */}
                <p> Likes: {userPostLikes?.length}</p>
                {/*
                    We did the length of the userPostLikes list since the number of likes is equal to how many ever entries we have
                    in the likes list 
                */}
            </div>
        </section>
    )
}