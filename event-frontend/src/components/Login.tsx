import { useState } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LOGIN_USER } from "../queries";
import { useNavigate } from "react-router";
import { loginSchema, type LoginSchema } from "../validation/loginSchema";

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

type LoginProps = {
  onLogin: (token: string, name: string) => void;
};

const Login: React.FC<LoginProps> = ( {onLogin}) =>{
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

  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    try {
      const result = await loginUser({ variables: data });

      if (result.data?.login) {
        console.log("Logged in user:", result.data.login.user.name);
        setSuccessMessage(`Welcome ${result.data.login.user.name} 👋`);
        //localStorage.setItem('events-user-token', result.data.login.value);
        onLogin(result.data.login.value,  result.data.login.user.name);
        reset(); // clear form after success
        navigate("/events");
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto"
    >
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          data-testid="login-email"
          id="email"
          type="email"
          {...register("email")}
          className="border p-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block">Password</label>
        <input
          data-testid="login-password"
          id="password"
          type="password"
          {...register("password")}
          className="border p-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="text-red-500">{serverError}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
};

export default Login;