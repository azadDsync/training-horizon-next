"use client"
import {GoogleLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
const GoogleAuth = () => {
    const router = useRouter();
    async function googleAuth(email:string,firstName:string,lastName:string,password:string) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/google-auth`, {
            email,
            firstName,
            lastName,
            password,
          });
    
          console.log(res.data.token);
    
          window.localStorage.setItem("token", res.data.token);
          router.push('/')
        } catch (error) {
          console.log(error);
        }
      }
  return (
    <>
    <center>
        <div className="mb-2 font-bold">or</div>
    <GoogleLogin
          onSuccess={(credentialResponse) => {
            if(credentialResponse.credential){
              const decoded = jwtDecode<{email:string ,given_name:string ,family_name:string,sub:string }>(credentialResponse?.credential);
            console.log(decoded);
            googleAuth(decoded.email,decoded.given_name,decoded.family_name,decoded.sub);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
   
    </center>
    </>
  );
};

export default GoogleAuth;
