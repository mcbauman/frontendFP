import Start from "./Routes/Start"
import Search from "./Routes/Search.jsx"
import Messages from "./Routes/Messages"
import Profile from "./Routes/Profile"
import Chats from "./Routes/Chats"
import {Routes,Route} from "react-router-dom"

// line for a check!

export default function Main(props){
    return(
        <main>
            <Routes>
                <Route path="*" element={<Start user= {props.user} token= {props.token} /> }/>
                <Route path="Search" element={<Search user= {props.user} token= {props.token}/>}/>
                <Route path="Messages" element={<Messages user= {props.user} token= {props.token}/>}/>
                <Route path="Chats/*" element={<Chats user= {props.user} token= {props.token}/>}/>
                <Route path="Profile" element={<Profile 
                    userProfPic={props.userProfPic} 
                    setUserProfPic={props.setUserProfPic} 
                    user= {props.user} 
                    token= {props.token}/> }/>
            </Routes>
        </main>
    )
}