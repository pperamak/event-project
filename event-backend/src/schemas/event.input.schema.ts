import { z } from "zod";


export const createEventInputSchema = z.object({
  name: z.string().min(1),
  
  time: z.coerce.date(),
  description: z.string().min(0),
  image: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional()   
  
  
});


