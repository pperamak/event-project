import { useState } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LOGIN_USER } from "../../queries/mutations";
//import { useNavigate } from "react-router";
import { loginSchema, type LoginSchema } from "../../validation/loginSchema";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router";

interface LoginUserData {
  login: {
    value: string;
    user: {
      name: string;
      email: string;
      id: string;
    };
  };
}

interface LoginUserVars {
  email: string;
  password: string;
}


const Login = ( ) =>{
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  //const onLogin=props.onLogin;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [loginUser] = useMutation<LoginUserData, LoginUserVars>(LOGIN_USER);

  //const navigate = useNavigate();

  const { login } = useAuth();

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    try {
      const result = await loginUser({ variables: data });

      if (result.data?.login) {
        console.log("Logged in user:", result.data.login.user.name);
        setSuccessMessage(`Welcome ${result.data.login.user.name} 👋`);
        //localStorage.setItem('events-user-token', result.data.login.value);
        login(result.data.login.value,  result.data.login.user.name);
        reset(); // clear form after success
        //navigate("/events");
      }
    } catch (e) {
      if (e instanceof ApolloError) {
        setServerError(e.graphQLErrors[0]?.message ?? e.message);
      } else if (e instanceof Error) {
        setServerError(e.message);
      } else {
        setServerError("Unknown error occurred");
      }
    }
  };

  return (
    <div className="mt-24 flex justify-center">
    <div className="w-full max-w-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            data-testid="login-email"
            id="email"
            type="email"
            {...register("email")}
            className="border p-2 w-full rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            data-testid="login-password"
            id="password"
            type="password"
            {...register("password")}
            className="border p-2 w-full rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-red-500">{serverError}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 text-white px-4 py-2 rounded w-full hover:bg-amber-800"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      {/* Paragraph now aligned to the left with form */}
      <p className="mt-4 text-sm">
        Not yet registered?{" "}
        <Link to="/register" className="text-blue-900 font-medium">
          Register
        </Link>
      </p>
    </div>
  </div>
  );
};

export default Login;