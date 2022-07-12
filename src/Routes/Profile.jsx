import {useEffect, useState} from "react";
import Activities from "../components/ActivitiesArray";
import axios from "axios";
import Select from "react-select";
import {MdOutlineDeleteForever,MdOutlineSaveAlt} from "react-icons/md";
import { AiOutlineDown } from "react-icons/ai"
import exmpl from "../components/exmpl.jpeg";
import React from "react";
import {Context}from "../components/context"
import trans from "../components/trans";
import {useContext} from "react";
import {toast, ToastContainer} from "react-toastify";
import logo from "../components/COF.png";
import {deleteFriend} from "../components/functions"
import "../components/Profile.scss";

export default function Profile(props){
    const [file, setFile] = useState(null)
    const [name,setName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [email, setEmail]=useState("")
    const [userName, setUserName]=useState("")
    const [interests,setInterests]=useState([])
    const [street, setStreet]=useState("")
    const [number, setNumber]=useState()
    const [zipCode, setZipCode]=useState()
    const [city, setCity]=useState("")
    const [country, setCountry]=useState("")
    const [profileText,setProfileText]=useState("")
    const {lang,setLang}=useContext(Context)
    const {theme,setTheme}=useContext(Context)
    const [usr,setUsr]=useState(null)
    const [p1,setP1]=useState("hide")
    const [p2,setP2]=useState("hide")
    const [p3,setP3]=useState("hide")
    const [p4,setP4]=useState("hide")
    const [p5,setP5]=useState("hide")
    const [p6,setP6]=useState("hide")
    const [p7,setP7]=useState("hide")
    const [passwords, setPasswords]=useState({pw1:"",pw2:""})
    const [friends,setFriends]=useState([])
    const notifySuccess = () => toast("Your profile is updated");
    const notifyDelFriend=()=>toast("friend removed ")
    const notify = (text) => toast(text);

    function loadUser(){
        const headers = { Authorization: `Bearer ${props.token}`}
        axios.get(`${process.env.REACT_APP_BE_SERVER}/user/updateProfile`,{headers})
        .then(result=> {
            result.data.interests=result.data.interests.map(item=>({"value":item,"label":item}))
            setUsr(result.data)
            console.log(result.data);
        })
        .catch(error => {
            if(error.response.data.error.message=="jwt expired"){
                localStorage.removeItem("token")
                props.setToken(null)
            }
    console.log(error)})
    }
        
    useEffect(()=>loadUser(),[])

    function handleSelectedFile(e){
        const extn = e.target.files[0].type.split('/')[1];
        const valid = ["gif", "png", "jpg", "jpeg"];
        if(e.target.files[0].size>2000000){
            return notify("File should be less then 2Mb")
        }else if(!valid.includes(extn)){
            return notify("Excepted format: png, gif, jpg, jpeg")
        }
        else{
            setFile(e.target.files[0])
        }
    }
    function saveFile(e){
        e.preventDefault()
        if(!file){return notify("Select file first!")}
        const formData = new FormData()
        formData.append("selectedFile", file)
        const headers = { Authorization: `Bearer ${props.token}`}
        axios.post(`${process.env.REACT_APP_BE_SERVER}/picture/createPicture`, formData, {headers} )
            .then(result =>  {
                notify("Picture uploaded")
                props.setUserProfPic(result.data._id)})
            .catch(error => console.log(error))
    }

    function changeProfile(e){
        e.preventDefault()
        const sendInterests=interests.length>1?interests.map(item=>item.value):usr.interests.map(item=>item.value);
        const body={
            name:name?name:usr.name,
            familyName:familyName?familyName:usr.familyName,
            email:email?email:usr.email,
            userName:userName?userName:usr.userName,
            profileText:profileText?profileText:usr.profileText,
            interests:sendInterests,
            street:street?street:usr.street, 
            number:number?number:usr.number, 
            zipCode:zipCode?zipCode:usr.zipCode, 
            city:city?city:usr.city, 
            country:country?country:usr.country
        }
        const headers = { Authorization: `Bearer ${props.token}`}
        axios.put(`${process.env.REACT_APP_BE_SERVER}/user/updateProfile`,body,{headers})
            .then(result=> {
                notifySuccess()
            })
            .catch(error => {
                console.log(error)
                notify(error)
            })
            
    }

    function setDefaults(e){
        e.preventDefault()
        localStorage.setItem("theme",JSON.stringify(theme))
        localStorage.setItem("lang",JSON.stringify(lang))
        const body2={
            theme,
            lang,
            name:name?name:usr.name,
            familyName:familyName?familyName:usr.familyName,
            email:email?email:usr.email,
            userName:userName?userName:usr.userName,
            profileText:profileText?profileText:usr.profileText,
            street:street?street:usr.street, 
            number:number?number:usr.number, 
            zipCode:zipCode?zipCode:usr.zipCode, 
            city:city?city:usr.city, 
            country:country?country:usr.country
        }
        const headers = { Authorization: `Bearer ${props.token}`}
        axios.put(`${process.env.REACT_APP_BE_SERVER}/user/updateProfile`,body2,{headers})
            .then(result=> {
                notifySuccess()
            })
            .catch(error => {
                console.log(error)
                notify(error)
            })
    }

    function deleteUserF(){
        const headers = { Authorization: `Bearer ${props.token}`}
        axios.delete(`${process.env.REACT_APP_BE_SERVER}/user/delete`,{headers})
            .then(result=> {
                notify(trans[lang].deleteUser)
            })
        console.log("delete user Function");
        console.log(props);
        props.setUser(null)
        props.setToken(null)
        props.setUserProfPic(null)
        setTheme("BW")
        setLang("de")
        localStorage.setItem("theme", "")
        localStorage.setItem("lang", "")
    }

    function changePasswordsF(e){
        e.preventDefault()
        console.log(passwords.pw1);
        console.log(passwords.pw2);
        if(passwords.pw1===passwords.pw2){
        const body={
            name:name?name:usr.name,
            familyName:familyName?familyName:usr.familyName,
            email:email?email:usr.email,
            userName:userName?userName:usr.userName,
            profileText:profileText?profileText:usr.profileText,
            street:street?street:usr.street, 
            number:number?number:usr.number, 
            zipCode:zipCode?zipCode:usr.zipCode, 
            city:city?city:usr.city, 
            country:country?country:usr.country,
            password:passwords.pw1
        }
        const headers = { Authorization: `Bearer ${props.token}`}
        axios.put(`${process.env.REACT_APP_BE_SERVER}/user/updateProfile`,body,{headers})
            .then(result=> {
                console.log(result.data);
                notify("Youre Password is Changed")
            })
            .catch(error => {
                if(error.response.data.error.message=="jwt expired"){
                    localStorage.removeItem("token")
                    props.setToken(null)
                }
                console.log(error)})
        }else{notify("Youre passwords are different")}
    }

usr&&usr.friends;
    return(
        <article id="profile">
                <h1 onClick={()=>setP1(p1==="hide"?"show":"hide")} > <AiOutlineDown/> {trans[lang].desginAndLang}</h1>
            <section>
                <form onSubmit={setDefaults} className={p1} >
                    {trans[lang].Theme}:
                    <select value={theme} onChange={(e)=>setTheme(e.target.value)}>
                        <option>BW</option>
                        <option>red</option>
                        <option>blue</option>
                        <option>green</option>
                    </select>
                    {trans[lang].language}:
                    <select value={lang} onChange={(e)=>setLang(e.target.value)}>
                        <option value="de">🇩🇪</option>
                        <option value="en">🇬🇧</option>
                    </select>
                    <button className="buttonSubmit" type="submit"><MdOutlineSaveAlt/></button>
                </form>
                </section>
                <hr/>
{/* CHANGE LOGINDATA */}
                <h1 onClick={()=>setP7(p7==="hide"?"show":"hide")} ><AiOutlineDown/> {trans[lang].changeLogInData}</h1>
                <section>
                    <form className={p7} onSubmit={changePasswordsF}>
                        {/* <input name="opw" type="password" defaultValue={passwords.opw} onChange={(e)=>{
                                    const x=e.target.name
                                    setPasswords({...passwords,x:e.target.value})
                        }} /> */}
                        <input name="pw1" type="password" placeholder="*****" defaultValue={passwords.pw1} onChange={(e)=>{
                                    const x=e.target.name
                                    setPasswords({...passwords,[x]:e.target.value})
                        }} />
                        <input name="pw2" type="password" placeholder="*****" defaultValue={passwords.pw2} onChange={(e)=>{
                                    const x=e.target.name
                                    setPasswords({...passwords,[x]:e.target.value})
                        }} />
                        <button type="submit"><MdOutlineSaveAlt/></button>
                    </form>
                </section>
                <hr/>
{/* PROFILPICTURE */}
                <h1 onClick={()=>setP2(p2==="hide"?"show":"hide")} ><AiOutlineDown/> {trans[lang].profPic}</h1>
                <section>
                <form onSubmit={saveFile} className={p2} >
                    {usr&&usr.profilePicture?(<img src={`${process.env.REACT_APP_BE_SERVER}/picture/${usr.profilePicture}`} alt="Profil-Picture"/>):<img src={exmpl}/>}
                    <input id="fileSelector" type="file" onChange={handleSelectedFile} />
                    <button className="buttonSubmit" type="submit"><MdOutlineSaveAlt/></button>
                </form>
            </section>
            <hr/>
{/* USERDATA */}
            <>
                {usr?(
                    <>
                    <h1 onClick={()=>setP3(p3==="hide"?"show":"hide")} ><AiOutlineDown/> {trans[lang].userData}</h1>
                    <section>
                    <form onSubmit={changeProfile} className={p3} >
                        <input type="text" placeholder={usr.name} value={name} 
                        onChange={(e)=>setName(e.target.value)} className="fullW"/>
                        <input type="text" placeholder={usr.familyName} value={familyName} 
                        onChange={(e)=>setFamilyName(e.target.value)} className="fullW"/>
                        <input type="email" placeholder={usr.email} value={email} 
                        onChange={(e)=>setEmail(e.target.value)} className="fullW"/>
                        <textarea placeholder={usr.profileText} value={profileText} 
                        onChange={(e)=>setProfileText(e.target.value)}/>
                        <Select onChange={setInterests} closeMenuOnSelect={false} 
                        isMulti options={Activities[lang]} defaultValue={usr.interests}/>
                        <button className="buttonSubmit" type="submit"><MdOutlineSaveAlt/></button>
                    </form>
                    </section>
{/* ADRESS */}
                    <hr/>
                    <h1 onClick={()=>setP4(p4==="hide"?"show":"hide")} ><AiOutlineDown/> {trans[lang].adress}</h1>
                   <section>
                   <form onSubmit={changeProfile} className={p4} >
                        <input type="text" value={street} onChange={e=>setStreet(e.target.value)} 
                        placeholder={usr.street} className="fullW"/>
                        <input type="number" value={number} onChange={e=>setNumber(e.target.value)} 
                        placeholder={usr.number} className="smallW"/>
                        <input type="number" value={zipCode} onChange={e=>setZipCode(e.target.value)} 
                        placeholder={usr.zipCode}/>
                        <input type="text" value={city} onChange={e=>setCity(e.target.value)} 
                        placeholder={usr.city} className="fullW"/>
                        <select onChange={e=>setCountry(e.target.value)} defautl={usr.country}>
                            <option>DE</option>
                            <option>AUT</option>
                            <option>CH</option>
                            <option>DK</option>
                            <option>NL</option>
                            <option>KE</option>
                            <option>PH</option>
                        </select>
                        <button className="buttonSubmit" type="submit"><MdOutlineSaveAlt/></button>
                    </form>
                   </section>
{/* FRIENDS */}
                    <hr/>
                    <h1 onClick={()=>setP5(p5==="hide"?"show":"hide")} ><AiOutlineDown/> {trans[lang].YoureFriends}:</h1>
                    <div className={p5}>
                    {usr.friends.map(item=>(
                        <section>
                            <div className="friendsView" id={item.userName}>
                            <div className="profPicDiv" 
                            style={{background:item.profilePicture?`url(${process.env.REACT_APP_BE_SERVER}/picture/${item.profilePicture})`:`url(${exmpl})`, backgroundPosition: "center", backgroundSize: "cover"}}></div>
                            <div>{item.userName}</div>
                            <button onClick={()=>{
                                deleteFriend(item._id,props.token,setFriends)
                                notify("friend removed, you see after reload")
                            }}>
                                <MdOutlineDeleteForever/></button>
                        </div>
                        </section>
                        ))}
                        </div>
{/* DELETEUSER */}
                    <hr/>
                    <h1 onClick={()=>setP6(p6==="hide"?"show":"hide")} ><AiOutlineDown/> {trans[lang].deleteUser}:</h1>
                    <div className={p6}>
                        <button onClick={deleteUserF} id="deleteUser">{trans[lang].deleteUser}</button>
                    </div>
                    </>
                ):<img src={logo} id="henriksLoadingAnimation" />}
            </>
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false}
                            newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss
                            draggable pauseOnHover/>
        </article>
    )
}