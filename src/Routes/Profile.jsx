import { useState } from "react";
import Activities from "../ActivitiesArray";
import axios from "axios";

export default function Profile(props){
    const [file, setFile] = useState(null)
    console.log(props)
    function handleSelectedFile(e){
        setFile(e.target.files[0]) // we use [] because key is a number here.
        console.log(e.target.files);
        console.log(e.target.files[0]);
    }
    function saveFile(e){
        // const [picture, setPicture ] = useState(null)
        if(!file){
            return alert("Select a file first:)")
        }
        const formData = new FormData()
        formData.append("selectedFile", file)

        const headers = { Authorization: `Bearer ${props.token}`}

        const config = {
            // data: formData,
            headers
        }
        axios.post(`${process.env.REACT_APP_BE_SERVER}/picture/createPicture`, formData, config )
            .then(result =>  props.setUserProfPic(result.data._id))
            .catch(error => console.log(error))

    }

    console.log("USER PROFILE from PROFILE.JSX L 34",props.userProfPic)
//    console.log("USER PROFILE ID from PROFILE.JSX L 34",props.userProfPic.data._id)
    return(
        <article>
            PROFILE
            <input type="file" onChange={handleSelectedFile} />
            <button onClick={saveFile}>Save Picture</button>
            {props.userProfPic&&<img src={`${process.env.REACT_APP_BE_SERVER}/picture/${props.userProfPic}`} alt="Ups, no picture;)"/>}
        </article>
    )
}