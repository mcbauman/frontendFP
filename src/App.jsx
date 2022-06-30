import Header from "./Header"
import Main from "./Main"
import Log from "./Log"
import {useEffect, useState} from "react"
import {Context}from "./components/context"
import {useContext} from "react";

const userFromLS=localStorage.getItem("user")
const userDefault=userFromLS?JSON.parse(userFromLS):null

const userProfPicLS = localStorage.getItem("userProfPic")
const userProfPicDefault=userFromLS?userProfPicLS:null

const tokenFromLS=localStorage.getItem("token")
const tokenDefault=tokenFromLS?tokenFromLS:null

export default function App(){
   const [user,setUser]=useState(userDefault)
   const [token,setToken]=useState(tokenDefault)
   const [userProfPic, setUserProfPic] = useState(userProfPicDefault)
   const {theme,setTheme}=useContext(Context)
    
   const [lat, setLat]=useState(0)
   const [leng,setLeng]=useState(0)


   useEffect(()=>{
      if(user){localStorage.setItem("user",JSON.stringify(user))
      }else{localStorage.removeItem("user")}
    },[user])
  
    useEffect(()=>{
      if(token){localStorage.setItem("token",(token))
      }else{localStorage.removeItem("token")}
    },[token])

    useEffect(()=>{
      localStorage.setItem("userProfPic",(userProfPic))
    },[userProfPic])
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    function success(pos) {
      const crd = pos.coords;
      
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      setLat(crd.latitude);
      setLeng(crd.longitude);

      }
      // console.log(lat,leng)
      function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options); 
   return(
      <div className={theme}>
         {user&&token?
         <>
            <Header setUser={setUser} setToken={setToken} setUserProfPic={setUserProfPic}/>
            <Main user={user} token={token} userProfPic={userProfPic} setUserProfPic={setUserProfPic}/>
         </>
         :<Log setUser={setUser} setToken={setToken} setUserProfPic={setUserProfPic} />
         }
      </div>
   )
}