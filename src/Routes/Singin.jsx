import { useState} from "react"
import axios from "axios"
import Select from "react-select";
import Activities from "../components/ActivitiesArray";
import {toast, ToastContainer} from "react-toastify";


export default function Singin(props){
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [userName, setUserName]=useState("")
    const [name,setName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [dateOfBirth,setDateOfBirth] = useState("")
    const [age,setAge]=useState(0)
    const [gender, setGender] = useState("male")
    const [interests,setInterests]=useState([])
    const [profileText,setProfileText]=useState("")
    const [street, setStreet]=useState("")
    const [number, setNumber]=useState()
    const [zipCode, setZipCode]=useState()
    const [city, setCity]=useState("")
    const [country, setCountry]=useState("")
    const options=Activities
    const notifySuccess = () => toast("Your profile is created");
    const notifyError = (text) => toast(text);

    function ageFunction(e){
        setDateOfBirth(e.target.value)
        setAge(Math.floor((Date.now()-new Date(e.target.value).getTime())/(31536000000)))
    }
    function submitFunction(e){
        e.preventDefault()
        const sendInterests=interests.map(item=>item.value)
        const data={age,email,password,userName,name,familyName,dateOfBirth,gender,interests:sendInterests,profileText, street, number, zipCode, city, country}
        axios.post(`${process.env.REACT_APP_BE_SERVER}/user/create`,data)
            .then(resp=>{
                props.setUser(resp.data._id)
                props.setToken(resp.data.token)
                notifySuccess()
            })
            .catch(err=>{
                notifyError(err?.response?.data?.error||"Something went wrong")
            })
    }
    
    return(
        <article>
            <form className="signin" onSubmit={submitFunction}>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/>
                <input type="text" value={familyName} onChange={e=>setFamilyName(e.target.value)} placeholder="Family Name"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="@"/>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
                <input type="text" value={userName} onChange={e=>setUserName(e.target.value)} placeholder="User-name" />
                <input type="date" value={dateOfBirth} onChange={ageFunction} placeholder="Date of birth"/>

                <input type="text" value={street} onChange={e=>setStreet(e.target.value)} placeholder="Street"/>
                <input type="number" value={number} onChange={e=>setNumber(e.target.value)} placeholder="Number"/>
                <input type="number" value={zipCode} onChange={e=>setZipCode(e.target.value)} placeholder="Zip-Code"/>
                <input type="text" value={city} onChange={e=>setCity(e.target.value)} placeholder="City"/>
                
                <select onchange={e=>setCountry(e.target.value)}>
                    <option>DE</option>
                    <option>AUT</option>
                    <option>CH</option>
                    <option>DK</option>
                    <option>NL</option>
                    <option>KE</option>
                    <option>PH</option>
                </select>

                <fieldset onChange={e=>setGender(e.target.id)}>
                    <input type="radio" name="gender" id="♂️"/><label htmlFor="♂️">♂️</label>
                    <input type="radio" name="gender" id="♀️"/><label htmlFor="♀️">♀️</label>
                    <input type="radio" name="gender" id="⚧"/><label htmlFor="⚧">⚧</label>
                </fieldset>
                <textarea rows="5" value={profileText} onChange={e=>setProfileText(e.target.value)} placeholder="tell us a bit about yourself"/>
                <input type="file" placeholder="choose avatar" />
                <Select closeMenuOnSelect={false} isMulti options={options} onChange={setInterests} />
                <button type="submit">save user</button>
            </form>
            <ToastContainer position="bottom-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover/>
        </article>
    )
}