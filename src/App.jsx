import Header from "./Header";
import Main from "./Main";
import Log from "./Log";
import { useEffect, useState } from "react";
import { Context } from "./components/context";
import { useContext } from "react";

const userFromLS = localStorage.getItem("user");
const userDefault = userFromLS ? JSON.parse(userFromLS) : null;

const userProfPicLS = localStorage.getItem("userProfPic");
const userProfPicDefault = userFromLS ? userProfPicLS : "";

const tokenFromLS = localStorage.getItem("token");
const tokenDefault = tokenFromLS ? tokenFromLS : null;

export default function App() {
  const [user, setUser] = useState(userDefault);
  const [token, setToken] = useState(tokenDefault);
  const [userProfPic, setUserProfPic] = useState(userProfPicDefault);
  const { theme, setLatitude, setLongitude } = useContext(Context);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (userProfPic) {
      localStorage.setItem("userProfPic", userProfPic);
    } else {
      localStorage.removeItem("userProfPic");
    }
  }, [userProfPic]);

  return (
    <div className={theme}>
      {user && token ? (
        <>
          <Header setUser={setUser} setToken={setToken}
            setUserProfPic={setUserProfPic}
          />
          <Main
            setUser={setUser} user={user} setToken={setToken}
            token={token} userProfPic={userProfPic}
            setUserProfPic={setUserProfPic}
          />
        </>
      ) : (
        <Log
          setUser={setUser} setToken={setToken}
          setUserProfPic={setUserProfPic}
        />
      )}
    </div>
  );
}
