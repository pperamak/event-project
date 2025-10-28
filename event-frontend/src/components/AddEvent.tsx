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
    <div>
      <h2>Add event</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
       <label htmlFor="name">Name</label>
       <input id="name" type="text" {...register("name")} placeholder="Event name" /> 
       {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register("description")} placeholder="Description" />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      
      <div>
        <label htmlFor="time">Date</label>
        <input id="time" type="datetime-local" {...register("time")} />
        {errors.time && <p>{errors.time.message}</p>}
      </div>
            
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating event.." : "Create Event"}</button>
    </form>
    {message && <p role="alert">{message}</p>}
    {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
    
  );
}

export default AddEvent;