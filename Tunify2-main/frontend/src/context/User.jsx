import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { url } from "../App";
 import {useCookies} from "react-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie , removeCookie] = useCookies(["token"]);
  // useEffect(() => {
  //   const navigationEntries = performance.getEntriesByType("navigation");
  //   if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
  //     console.log("Page was reloaded!");
  //     if (cookies.token) {
  //       setIsAuth(true);
  //     } else {
  //       setIsAuth(false);
  //     }
  //     setLoading(false);
      
  //   }
  // }, []);
  useEffect(() => {
    // Whenever page loads, check if token exists
    if (cookies.token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [cookies.token]); 

  async function registerUser(
    firstName,
    lastName,
    email,
    password,
    navigate
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
    //   setBtnLoading(false);
      navigate("/");
    //   fetchSongs();
    //   fetchAlbums();
    } catch (error) {
      toast.error(error.response.data.message);
    //   setBtnLoading(false);
    }
  }
  useEffect(() => {
    if (cookies.token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    setLoading(false);
  }, [cookies.token]);
  async function loginUser(email, password, navigate) {
     

    // setBtnLoading(true);
    // 
    try {
        const { data } = await axios.post(`${url}/api/auth/login`, {
          email,
          password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        console.log(data);
        const token = data.token;
        const date = new Date();
        date.setDate(date.getDate() + 30);
        setCookie("token", token, {path: "/", expires: date});
    
        toast.success(data.message);
        // setUser(data.user); // Uncomment if you want to store user data
        setIsAuth(true);
        navigate("/home");
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");

      // setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      const { data } = await axios.get("/api/auth/logout");
      removeCookie("token", { path: "/" });

      setIsAuth(false);
      navigate("/")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addToPlaylist(id) {
    try {
      const { data } = await axios.post("/api/user/song/" + id);

      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  
  
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        // registerUser,
        // user,
        isAuth,
        setIsAuth,
        // btnLoading,
        // loading,
        loginUser,
        logoutUser,
        // addToPlaylist,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);