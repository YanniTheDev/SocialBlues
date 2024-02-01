import "../App.css"

//Going to import the things that we need
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//addDoc is the function we call when we want to add a document to our database
//collection is a function that we use to specify which collection we want to add a document to
import { addDoc, collection } from "firebase/firestore";
import { auth, database } from "../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";

import loading from "../Images/loading.png";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
    title: string,
    description: string
}


export const CreatePostForm = () => {

    //We will have to create a schema
    const schema  = yup.object().shape({
        title: yup.string()
                  .trim()
                  .max(50, "Title cannot exceed 50 characters")
                  .required("Your post must have a title"), //Creating the shape with the error messages
        description: yup.string()
                        .trim()
                        .max(150, "Description cannot exceed 150 characters")
                        .required("You must include a description")
    })

    //A lot of these functions are explained in one of the previous topics. It was in the form topic IIRC
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<CreateFormData>({ //Giving the data type of the useForm
        resolver: yupResolver(schema)
    });

    //This variable is a reference to our collection that we are going to be adding documents to
    const userPostsReference = collection(database, "userPosts") //Specifying which database we are connecting to, and what collection. The collection name will be found on the Firebase console

    const [user] = useAuthState(auth); //Getting user data

    const [finishedAddingPost, setFinishedAddingPost] = useState<boolean>(true);

    const navigate = useNavigate();

    const onCreatePost = async (data: CreateFormData) => {
        //When the submit button is clicked, we will want to sent the data to the Firestore database
        setFinishedAddingPost(false);

        const date = new Date();

        //We will be referencing which collection we are going to be adding data to
        await addDoc(userPostsReference, {
            ...data, //Since the only thing in data is a description and title, we can use the spread operator to compress the object and insert it here
            username: user?.displayName,
            userID: user?.uid,
            unixTimeCreated: date.getTime()
        })

        setFinishedAddingPost(true);
        
        navigate("/");
    }

    const [titleLength, setTitleLength] = useState<number>(0);
    const [descriptionLength, setDescriptionLength] = useState<number>(0);

    const changeCurrentTitleLength = (event:any) => {
        setTitleLength(event.target.value.length);
    }

    const changeCurrentDescriptionLength = (event:any) => {
        setDescriptionLength(event.target.value.length);
    }
    
    return (
        <form onSubmit={handleSubmit(onCreatePost)} className="create-post-form display-flex-column-c-c"> {/* When created post, will execute the onCreatePost function */}
            {/* 
                We need two fields: the description and the title. So just two inputs, one for title and one for description
                The reason for this is because the username and userID is already provided when the user logs in. So it will 
                be the same for each user. However, each post the user creates will most likely not be the same, so we need
                to provide a field for them to input it.
            */}
            
            <div>
                {errors.title && <p className="text-color-red error-text"> <b>{errors.title?.message}</b> </p>}
                <input type="text" 
                       placeholder="Title..." {...register("title")} 
                       onChange={
                            (event) => {
                                changeCurrentTitleLength(event);
                            }
                        }/>
                <p className="input-length" style={ titleLength > 50 ? {color: "red"} : {color: "white"} }> 
                    {titleLength} / 50 
                </p>
            </div>
            
            <div>
                {errors.description && <p className="text-color-red error-text"> <b>{errors.description?.message}</b></p>}
                <textarea placeholder="Description..." {...register("description")} 
                          onChange={
                            (event) => {
                                changeCurrentDescriptionLength(event);
                            }
                          }/> 
                          {/* We will be using a text area so that the users can read what they are typing much easier*/}
                <p className="input-length" style={ descriptionLength > 150 ? {color: "red"} : {color: "white"}}> 
                    {descriptionLength} / 150 
                </p>
            </div>
            
            <section className="submit-post-section">
                <input type="submit" value="Submit" className="create-post-submit-button"/> {/* We will have to use type submit in order to work with react-hook-form */}
                {!finishedAddingPost && (
                    <img src={loading} alt="Loading Wheel" className="submit-form-loading-wheel loading-wheel"/>
                )}
            </section>
        </form>
    );
}