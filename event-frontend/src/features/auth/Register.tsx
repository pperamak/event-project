import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../queries/queries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/registerSchema";
import { type RegisterSchema } from "../../validation/registerSchema";
import { ApolloError } from "@apollo/client";
import { Link } from "react-router";

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
const Register = () =>{
  const [serverError, setServerError]=useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // validate on blur (instant feedback)
  });

  

  const [createUser] = useMutation<CreateUserData, CreateUserVars>(CREATE_USER);

  const onSubmit = async (data: RegisterSchema) =>{
    setServerError(null);
    try {
      const { name, email, password } =data;
      const result = await createUser({ variables: { name, email, password } });
    
      if (!result.data){
        throw new Error("No data returned");
      }
    
      setSuccessMessage("Registration successful ✅");
      console.log("Created user:", result.data.createUser);
      reset();
  } catch (e) {
  if (e instanceof ApolloError) {
    if (e.graphQLErrors.length > 0) {
      setServerError(e.graphQLErrors[0].message);
    } else if (e.networkError) {
      setServerError("Network error. Please try again.");
    } else {
      setServerError(e.message);
    }
  } else if (e instanceof Error) {
    // fallback for generic errors
    setServerError(e.message);
  } else {
    setServerError("Unknown error occurred");
  }
}

  };
  
  return (
  <div className="mt-24 flex justify-center">
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="border p-2 w-full rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
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
            id="password"
            type="password"
            {...register("password")}
            className="border p-2 w-full rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="border p-2 w-full rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-red-500">{serverError}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 text-white px-4 py-2 rounded w-full hover:bg-amber-800"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-900 font-medium">
          Log in
        </Link>
      </p>
    </div>
  </div>
);
    
};

export default Register;