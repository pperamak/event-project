import { useState } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LOGIN_USER } from "../queries";
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

const Login = () => {
  const [serverError, setServerError] = useState<string | null>(null);

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

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    try {
      const result = await loginUser({ variables: data });

      if (result.data?.login) {
        console.log("Logged in user:", result.data.login.user.name);
        alert(`Welcome ${result.data.login.user.name} 👋`);
        reset(); // clear form after success
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
        <label className="block">Email</label>
        <input
          type="email"
          {...register("email")}
          className="border p-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block">Password</label>
        <input
          type="password"
          {...register("password")}
          className="border p-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="text-red-500">{serverError}</p>}

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