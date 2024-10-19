"use client"

import React, { useState, useEffect } from "react"
import { HeartIcon, PhoneIcon, MailIcon } from "lucide-react"

// Card component
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-mainColor rounded-lg shadow-lg ${className}`}>{children}</div>
)

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
)

// Button component
const Button = ({ className, onClick, disabled, children }: { className?: string; onClick?: () => void; disabled?: boolean; children: React.ReactNode }) => (
  <button
    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
)

// Avatar component
const Avatar = ({ src, alt, fallback, className }: { src: string; alt: string; fallback: string; className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <img src={src} alt={alt} className="rounded-full w-full h-full object-cover" />
    {!src && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-semibold">
        {fallback}
      </div>
    )}
  </div>
)

interface Pet {
  id: number
  name: string
  age: string
  gender: string
  breed: string
  imageUrl: string
  seller: {
    name: string
    phone: string
    email: string
  }
}

const pets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    age: "2 years",
    gender: "Male",
    breed: "Golden Retriever",
    imageUrl: "/pngegg.png",
    seller: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john@example.com"
    }
  },
  {
    id: 2,
    name: "Luna",
    age: "1 year",
    gender: "Female",
    breed: "Siamese Cat",
    imageUrl: "/pngegg.png",
    seller: {
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      email: "jane@example.com"
    }
  },
  {
    id: 3,
    name: "Max",
    age: "3 years",
    gender: "Male",
    breed: "German Shepherd",
    imageUrl: "/pngegg.png",
    seller: {
      name: "Alice Johnson",
      phone: "+1 (555) 246-8135",
      email: "alice@example.com"
    }
  }
]

export default function Component() {
  const [currentPetIndex, setCurrentPetIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [sliding, setSliding] = useState(false)

  useEffect(() => {
    if (sliding) {
      const timer = setTimeout(() => {
        setSliding(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [sliding])

  const nextPet = () => {
    setDirection(1)
    setSliding(true)
    setCurrentPetIndex((prevIndex) => (prevIndex + 1) % pets.length)
  }

  const previousPet = () => {
    setDirection(-1)
    setSliding(true)
    setCurrentPetIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length)
  }

  const currentPet = pets[currentPetIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-[rgba(94,84,142,0.2)] to-[rgba(94,84,142,0.8)] p-4">
       <h1 className="text-3xl pb-5 font-bold text-white mb-4 relative">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-200 rounded-lg blur-md opacity-50"></span>
          REHOMING
        </h1>
      <Card className="w-full max-w-xs mx-auto overflow-hidden shadow-4xl transition-transform duration-300 hover:scale-105">
        <CardContent className="p-0 relative">
          <div
            className={`transition-transform duration-300 ease-in-out ${
              sliding ? (direction > 0 ? "-translate-x-full" : "translate-x-full") : "translate-x-0"
            }`}
          >
            <div className="relative">
              <img
                src={currentPet.imageUrl}
                alt={currentPet.name}
                className="w-full h-[200px] object-cover"
              />
              <Button
                className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white hover:text-[rgba(94,84,142,1)] transition-all px-2 py-1 duration-300 p-2"
              >
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </div>
            <div className="p-6 bg-gradient-to-br from-[rgba(94,84,142,0.1))] to-[rgba(94,84,142,0.9)] text-white">
              <h2 className="text-xl font-bold mb-1">{currentPet.name}</h2>
              <p className="text-gray-200 mb-4">
                {currentPet.breed} &bull; {currentPet.age} &bull; {currentPet.gender}
              </p>
              <div className="flex items-center mb-4">
                <Avatar
                  src="/profile.png"
                  alt={currentPet.seller.name}
                  fallback={currentPet.seller.name.charAt(0)}
                  className="h-8 w-8 mr-2 border-2 border-white"
                />
                <div>
                  <p className="font-semibold text-lg">{currentPet.seller.name}</p>
                  <p className="text-sm text-gray-300">Seller</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Button className="w-full flex items-center justify-start hover:bg-white/20 transition-colors duration-300 bg-white/10">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>{currentPet.seller.phone}</span>
                </Button>
                <Button className="w-full flex items-center justify-start hover:bg-white/20 transition-colors duration-300 bg-white/10">
                  <MailIcon className="h-4 w-4 mr-2" />
                  <span>{currentPet.seller.email}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center mt-3 space-x-3">
        <Button
          onClick={previousPet}
          className="rounded-full bg-white text-[rgba(94,84,142,1)] hover:bg-[rgba(94,84,142,1)] hover:text-white transition-all duration-300 transform hover:scale-110"
          disabled={sliding}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="sr-only">Previous pet</span>
        </Button>
        <Button
          onClick={nextPet}
          className="rounded-full bg-white text-[rgba(94,84,142,1)] hover:bg-[rgba(94,84,142,1)] hover:text-white transition-all duration-300 transform hover:scale-110"
          disabled={sliding}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="sr-only">Next pet</span>
        </Button>
      </div>
    </div>
  )
}