"use client"

import React, { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from 'react-toastify'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl } from "./ui/form"
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image"
import { createRehomingPet } from "@/lib/action"
import { RehomingPet } from "@prisma/client"
import { FormProvider } from "react-hook-form"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  breed: z.string().min(1, "Breed is required"),
  type: z.string().min(1, "Type is required"),
  imageUrl: z.string().url().optional().nullable(),
  sellerName: z.string().min(1, "Seller name is required"),
  sellerPhone: z.string().min(1, "Seller phone is required"),
  sellerEmail: z.string().email("Invalid email address"),
})

export default function PetRehoming({ initialPets }: { initialPets: RehomingPet[] }) {
  const [pets, setPets] = useState<RehomingPet[]>(initialPets)
  const [searchType, setSearchType] = useState("")
  const { isLoaded, isSignedIn, user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      type: "",
      breed: "",
      imageUrl: "",
      sellerName: "",
      sellerPhone: "",
      sellerEmail: "",
    },
  })

  const [img, setImg] = useState<string | null>(null);
  const [resource, setResource] = useState();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAdmin) {
      toast.error("Only administrators can add pets for rehoming.")
      return
    }

    try {
      const petData = {
        ...values,
        imageUrl: values.imageUrl || '' // Provide a default empty string if imageUrl is null or undefined
      }
      const result = await createRehomingPet({ success: false, error: null }, petData)
      if (result.success) {
        toast.success("Pet added for rehoming successfully!")
        setPets([...pets, result.data])
        form.reset()
      } else {
        toast.error(result.error || "Failed to add pet for rehoming. Please try again.")
      }
    } catch (error) {
      console.error("Error creating rehoming pet:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const filteredPets = pets.filter(pet =>
    pet.type.toLowerCase().includes(searchType.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pets for Rehoming</h1>
      <Input
        type="text"
        placeholder="Search by pet type..."
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-lg shadow-md p-6">
            <Image src={pet.imageUrl} alt={pet.name} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-bold mb-2">{pet.name}</h2>
            <p className="text-gray-600 mb-2">{pet.breed} • {pet.age} • {pet.gender}</p>
            <p className="text-gray-600 mb-4">{pet.type}</p>
            <div className="border-t pt-4">
              <p className="font-semibold">Seller: {pet.sellerName}</p>
              <p>{pet.sellerPhone}</p>
              <p>{pet.sellerEmail}</p>
            </div>
          </div>
        ))}
      </div>
      {isAdmin && (
         <FormProvider {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
           <h2 className="text-xl font-bold">Add New Pet for Rehoming</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seller Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seller Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seller Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
              </FormItem>
            )}
          />
          <CldUploadWidget uploadPreset="tapales" onSuccess={(result: any) => {
          setImg(result.info.secure_url);
        }}>
          {({ open }) => (
            <button
              className="text-lg text-gray-800 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              Upload a photo
            </button>
          )}
        </CldUploadWidget>
          <Button type="submit">Submit</Button>
        </form>
        </FormProvider>
      )}
    </div>
  )
}
