import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../queries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema";
import { type RegisterSchema } from "../validation/registerSchema";
import { ApolloError } from "@apollo/client";

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input id="name" {...register("name")} className="border p-2 w-full" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block">Email</label>
        <input id="email" {...register("email")} type="email" className="border p-2 w-full" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block">Password</label>
        <input id="password" {...register("password")} type="password" className="border p-2 w-full" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block">Confirm Password</label>
        <input id="confirmPassword" {...register("confirmPassword")} type="password" className="border p-2 w-full" />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && <p className="text-red-500">{serverError}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
    
};

export default Register;