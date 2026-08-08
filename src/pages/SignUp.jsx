import React, { useContext, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import { userDataContext } from "../context/UserContext.jsx";
import { toast } from "react-toastify";

function SignUp() {
  let [show, setShow] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let { loading, setLoading } = useContext(authDataContext);

  const handleSignUp = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      let result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          name,
          email,
          password,
        },
        { withCredentials: true },
      );
      setLoading(false);
      (setUserData(result.data), navigate("/"));
      toast.success("SignUp succesfull");
      console.log(result);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center relative">
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[20px] rounded-[50%] 
            flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <FaLongArrowAltLeft className="w-[25px] h-[25px] text-[white]" />
      </div>
      <form
        // action=""
        className="max-w-[900px] w-[90%] h-[600px] flex items-center 
        justify-center  flex-col md:items-start gap-[10px]"
        onSubmit={handleSignUp}
      >
        <h1 className="text-[30px] text-[black]">Welcome to Airbnb</h1>
        <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] mt-[30px]">
          <label htmlFor="name" className="text-[20px] ">
            UserName
          </label>
          <input
            type="text"
            id="name"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] 
            rounded-lg px-[20px] text-[18px]"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />{" "}
        </div>
        <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
          <label htmlFor="email" className="text-[20px]">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg 
            px-[20px] text-[18px]"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] relative">
          <label htmlFor="password" className="text-[20px]">
            Password
          </label>
          <input
            type={show ? "text" : "password"}
            id="password"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg 
            px-[20px] text-[18px] "
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!show && (
            <FaEye
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
              onClick={() => {
                setShow((prev) => !prev);
              }}
            />
          )}{" "}
          {show && (
            <FaEyeSlash
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
              onClick={() => {
                setShow((prev) => !prev);
              }}
            />
          )}{" "}
        </div>
        <button
          className="px-[50px] py-[10px] bg-[#a03535] text-[white] text-[18px] md:px-[100px] rounded-lg mt-[20px]"
          type="submit"
          disabled={loading}
        >
          {loading ? "loading.." : "SignUp"}
        </button>
        <p className="text-[18px]">
          Already have a account?
          <span
            className="text-[19px] text-[red] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
