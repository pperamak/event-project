import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "../validation/eventFormSchema";
import type { EventFormSchema } from "../validation/eventFormSchema";
import { CREATE_EVENT } from "../queries";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";

export function AddEvent() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset 
} = useForm({
    resolver: zodResolver(eventFormSchema),
    mode: "onBlur"
  });

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  
  const [createEvent] = useMutation(CREATE_EVENT);
  const onSubmit = async (data: EventFormSchema) => {
    //console.log("AddEvent submit clicked");

    setMessage(null);
    setErrorMessage(null);
    try{
      const { name, description, time } =data;
      const isoTime = new Date(time).toISOString();
      const result = await createEvent({ variables: { name, description, time: isoTime }});
      console.log("Created event: ", result.data.createEvent);
      setMessage(`Event "${result.data.createEvent.name}" created successfully!`);
      reset();
    }catch(e){
      setErrorMessage("Failed to create event");
      console.log(e);
    }
  };

  useEffect(() => {
    if (message || errorMessage) {
      const timer = setTimeout(() => {
        setMessage(null);
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, errorMessage]);

  return (
    <div className="mt-24 flex justify-center">
    <div className="w-full max-w-xl border-red-900 p-2 rounded bg-red-200">
      <h1 className="text-2xl">Add event</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div>
       <label htmlFor="name" className="block font-medium">Name</label>
       <input id="name" type="text" {...register("name")} placeholder="Event name" className="bg-red-100 w-full" /> 
       {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div className="mt-2">
        <label htmlFor="description" className="block font-medium">Description</label>
        <textarea id="description" {...register("description")} placeholder="Description" className="bg-red-100 w-full"/>
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      
      <div className="mt-2">
        <label htmlFor="time" className="block font-medium">Date</label>
        <input id="time" type="datetime-local" {...register("time")} className="bg-red-100"/>
        {errors.time && <p>{errors.time.message}</p>}
      </div>
            
      <button type="submit" disabled={isSubmitting} className="bg-red-400 text-white px-4 py-2 mt-4 rounded hover:bg-red-600">
        {isSubmitting ? "Creating event.." : "Create Event"}</button>
    </form>
    {message && <p role="alert">{message}</p>}
    {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
    </div>
    
  );
}

export default AddEvent;