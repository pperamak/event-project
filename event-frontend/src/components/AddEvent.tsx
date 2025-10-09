import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "../validation/eventFormSchema";
import type { EventFormSchema } from "../validation/eventFormSchema";
import { CREATE_EVENT } from "../queries";
import { useMutation } from "@apollo/client";

export function AddEvent() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset 
} = useForm({
    resolver: zodResolver(eventFormSchema),
    mode: "onBlur"
  });


  //Authorization!!

  
  const [createEvent] = useMutation(CREATE_EVENT);
  const onSubmit = async (data: EventFormSchema) => {
    try{
      const { name, description, time } =data;
      const result = await createEvent({ variables: { name, description, time }});
      console.log("Created event: ", result.data.createEvent);
      reset();
    }catch(e){
      console.log(e);
    }
  };

  return (
    <div>
      <h2>Add event</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
       <input type="text" {...register("name")} placeholder="Event name" /> 
       {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <textarea {...register("description")} placeholder="Description" />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      
      <div>
        <input type="datetime-local" {...register("time")} />
        {errors.time && <p>{errors.time.message}</p>}
      </div>
            
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating event.." : "Create Event"}</button>
    </form>
    </div>
    
  );
}

export default AddEvent;