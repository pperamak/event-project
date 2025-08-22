import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../queries";

const Register = () =>{
  const [name, setName]=useState('');
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');

  interface CreateUserData {
  createUser: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateUserVars {
  name: string;
  email: string;
  password: string;
}

  const [createUser, { data, loading, error }] = useMutation<CreateUserData, CreateUserVars>(CREATE_USER);

  const submit = async (event: React.SyntheticEvent) =>{
    event.preventDefault();
    try {
    const result = await createUser({ variables: { name, email, password } });
    console.log("Created user:", result.data?.createUser);
  } catch (e) {
    // onError is still useful, but you can also catch here
    console.error("Registration failed", e);
  }
  setName('');
  setEmail('');
  setPassword('');
  };
  
  return (
      
    <div>
      <div>
       {loading && <p>Registering user...</p>}
        {error && <p style={{color: "red"}}>{error.message}</p>}
        {data && <p>Welcome {data.createUser.name}!</p>}  
      </div>
      <form onSubmit={submit}>
        <div>
          name
          <input
          value={name}
          onChange={({target}) =>setName(target.value)}
          />
        </div>
        <div>
          email
          <input
          value={email}
          onChange={({target}) =>setEmail(target.value)}
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
            register
          </button>
      </form>

    </div>
  );
};

export default Register;