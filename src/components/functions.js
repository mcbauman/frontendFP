import axios from "axios";

function isFriend(id,friends){
//    console.log(friends)
//    console.log(id)
    if(friends.includes(id)){
        return "activeFriend"
    }else{
        return "inactiveFriend"
    }
}

function checkFriends(token,setFriends){
    const headers = { Authorization: `Bearer ${token}` }
    axios.get(`${process.env.REACT_APP_BE_SERVER}/user/checkFriends`,{headers})
        .then(res=>{
            // console.log(res.data)
            setFriends(res.data)
        })
}

function addFriend(id,token,setFriends){
    const headers = { Authorization: `Bearer ${token}` }
    const data={friends:id}
    axios.put(`${process.env.REACT_APP_BE_SERVER}/user/addFriend`,data, {headers})
        .then(res => {
            console.log(`friend ${id} added`)
            checkFriends(token,setFriends)
        })
        .catch(error => alert(error.response?.data?.error || "Unknown error"))
    
}

function deleteFriend(id,token,setFriends){
    const headers = { Authorization: `Bearer ${token}` }
    const data={friends:id}
    axios.put(`${process.env.REACT_APP_BE_SERVER}/deleteFriend`,data, {headers})
        .then(res => {
            console.log(`friend left ${res.data.friends}`)
            checkFriends(token,setFriends)
        })
        .catch(error => alert(error.response?.data?.error || "Unknown error"))
    
}

export{isFriend,checkFriends,addFriend,deleteFriend}