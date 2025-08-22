import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../queries";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 

  interface LoginUserData {
    login: {
      value: string;
      user: {
        name: string;
        email: string;
        id: string;
      }
    }
  }

  interface LoginUserVars {
    email: string;
    password: string;
  }

  const [loginUser, { data, loading, error }] =useMutation<LoginUserData, LoginUserVars>(LOGIN_USER);


  const submit = async (event: React.SyntheticEvent) =>{
    event.preventDefault();
    try{
      const result = await loginUser({variables: { email, password}});
      console.log("Logged in user:", result.data?.login.user.name);
    }catch (e) {
    console.error("Login failed", e);
  }
  setEmail('');
  setPassword('');
  };

  return (
    <div>
      <div>
       {loading && <p>Logging in user...</p>}
        {error && <p style={{color: "red"}}>{error.message}</p>}
        {data && <p>Welcome {data.login.user.name}!</p>}  
      </div>
      <form onSubmit={submit}>
        <div>
          email
          <input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          />
        </div>
        <div>
          password 
          <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          />
         </div>
         <button onClick={submit} type="button">
          log in
         </button>
      </form>
    </div>
  );
};

export default Login;