import { z } from "zod";

export const petSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Pet name is required!" }),
  type: z.enum(["Dog", "Cat"], { message: "Type must be either dog or cat!" }),
  breed: z.string().min(3, { message: "Breed must be at least 3 characters long!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "Birthday is required and must be a valid date!",
  }),
  sex: z.enum(["male", "female"], { message: "Sex must be either male or female!" }),
  img: z.string().url().optional().nullable(),
});
  
  export type PetSchema = z.infer<typeof petSchema>;

  