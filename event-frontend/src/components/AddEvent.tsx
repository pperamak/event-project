import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "../validation/eventFormSchema";
import type { EventFormSchema } from "../validation/eventFormSchema";
import { CREATE_EVENT } from "../queries";
import { GET_SIGNATURE } from "../queries";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";


type GetSignatureResponse = {
  getCloudinarySignature: {
    apiKey: string;
    cloudName: string;
    signature: string;
    timestamp: number;
  };
};

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown; // in case Cloudinary adds extra fields
}


export function AddEvent() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset 
} = useForm({
    resolver: zodResolver(eventFormSchema),
    mode: "onBlur"
  });

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [getSignature] = useMutation<GetSignatureResponse>(GET_SIGNATURE);

  const handleUpload = async (file: File): Promise<string>=>{
    
    const { data } = await getSignature();
    if (!data?.getCloudinarySignature) {
      throw new Error("Failed to get signature from backend");
    }
    const sig = data.getCloudinarySignature;
    console.log(sig);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp.toString());
    formData.append("signature", sig.signature);
    //formData.append("upload_preset", "events_preset");
     //formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
    formData.append("folder", "events");
   

    //console.log("formData:", formData);
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: formData }
    );

    console.log(uploadRes);
    const json = (await uploadRes.json()) as CloudinaryUploadResult;
    return json.secure_url;
  };
  
  const [createEvent] = useMutation(CREATE_EVENT);
  const onSubmit = async (data: EventFormSchema) => {
    //console.log("AddEvent submit clicked");

    setMessage(null);
    setErrorMessage(null);
    try{
      const { name, description, time } =data;
      const file = data.image?.[0];
      let imageUrl = null;
      if (file){
        imageUrl= await handleUpload(file);
      }
      const isoTime = new Date(time).toISOString();
      const result = await createEvent({ variables: { name, description, time: isoTime, image: imageUrl }});
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

      <div className="mt-2">
        <label htmlFor="image" className="block font-medium">Image</label>
        <input id="image" type="file" {...register("image")} className="bg-red-100"  accept="image/*"/>
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