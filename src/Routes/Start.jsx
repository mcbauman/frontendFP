import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from 'react';
import exmpl from "../components/exmpl.jpeg"
import { BiSend } from "react-icons/bi"
import { MdOutlineSaveAlt } from "react-icons/md";
import logo from "../components/COF.png";
import { Context } from "../components/context"
import trans from "../components/trans";
import { useContext } from "react";
import "../components/Start.scss";

export default function Forum(props) {
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const notifyFeedback = (text) => toast(text);
    const topicNotify = () => toast("Topic is saved!")
    const [posts, setPosts] = useState(null)
    const [comment, setComment] = useState(null)
    const [vis, setVis] = useState(false)
    const { lang, } = useContext(Context)

    useEffect(() => {
        getPosts()
    }, [])


    function getPosts() {
        const headers = { Authorization: `Bearer ${props.token}` };
        axios
            .get(`${process.env.REACT_APP_BE_SERVER}/posts`, { headers })
            .then((res) => {
                setPosts(res.data);
                console.log("POSTS: ", res.data);
            })
            .catch((error) => {
                if(error.response.data.error.message=="jwt expired"){
                    localStorage.removeItem("token")
                    props.setToken(null)
                }
                if(error.response)
                    {if(error.response.data)
                        {notifyFeedback(error.response?.data?.error)}}
                else{notifyFeedback( "Unknown error")}})
    }

    function declareTopic(e) {
        e.preventDefault()
        const data = { author: props.user, content, subject }
        const headers = { Authorization: `Bearer ${props.token}` }
        axios.post(`${process.env.REACT_APP_BE_SERVER}/posts`, data, { headers })
            .then(res => {
                getPosts()
                topicNotify()
                setContent("")
                setSubject("")
            })
            .catch(error => notifyFeedback(error.response.data.error[0].content || "Unknown error"))
    }

    function commentPost(post, userId, e) {
        e.preventDefault()
        post.comments.push({ author: userId, comment })
        const headers = { Authorization: `Bearer ${props.token}` }
        console.log(post);
        if (comment) {
            axios.put(`${process.env.REACT_APP_BE_SERVER}/posts/addComment/${post._id}`, { author: userId, comment }, { headers })
                .then(res => {
                    getPosts()
                    setComment("")
                })
                .catch(error => notifyFeedback(error.response.data.error[0].content || "Unknown error"))
        }
    }

    return (
        <article id="forumStart">
            <form onSubmit={declareTopic}>
                <input type="text" placeholder={trans[lang].subject} value={subject} onChange={e => setSubject(e.target.value)} />
                <button type='submit' ><MdOutlineSaveAlt /></button>
                <textarea type="text" placeholder={trans[lang].postText} value={content} onChange={e => setContent(e.target.value)} />
            </form>
            <hr />
            {/* <Post  /> */}
            {posts && posts.length ? (posts.map(item =>
                <section key={item._id}>
                    <div className="forumClass" onClick={() => setVis(vis ? 0 : item._id)}>
                        <img src={item.author.profilePicture ? `${process.env.REACT_APP_BE_SERVER}/picture/${item.author.profilePicture}` : exmpl} />
                        <div className="divStartNextPicture">
                            <div><span>{trans[lang].createdBy}</span>{item.author.userName}</div>
                            <div><span>{trans[lang].createdAt} </span>{new Date(item.createdAt).toLocaleDateString()}</div>
                            <div className='subj'><span>{trans[lang].subject}: </span>{item.subject}</div>
                        </div>
                        <div className='cont'>{item.content}</div>
                    </div>
                    <form onSubmit={(e) => commentPost(item, props.user, e)}
                        className={vis === item._id ? "show" : "hide"}
                    >
                        <input value={comment} onChange={(e) => setComment(e.target.value)}
                            placeholder={trans[lang].leaveComment} className="maxW" />
                        <button type='submit' className="btn2"><BiSend /></button>
                    </form>
                    <div className={vis === item._id ? "show" : "hide"} id="startChat" >
                        {item.comments && item.comments.length && (item.comments.map((answer,index) => (
                            <div key={index}className={answer.author == props.user ? "right flex" : "left flex"}>
                                <div className="profileText">{answer.comment} </div><br />
                            </div>)))
                        }
                    </div>
                </section>
            )) : <img src={logo} id="henriksLoadingAnimation" />}
            <br />
            <ToastContainer position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
        </article>
    )
}
