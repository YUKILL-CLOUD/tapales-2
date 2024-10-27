'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { createAppointment, getBookedTimes } from '@/lib/action';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Pet = {
  id: number;
  name: string;
};

type Service = {
  id: number;
  name: string;
};

type AppointmentFormProps = {
  pets: Pet[];
  services: Service[];
  onClose: () => void;
  onAppointmentCreated: () => void;
};

type AppointmentFormData = {
  petId: string;
  serviceId: string;
  date: string;
  time: string;
  notes: string;
};

export function AppointmentForm({ pets, services, onClose, onAppointmentCreated }: AppointmentFormProps) {
  const { register, handleSubmit, reset, setValue } = useForm<AppointmentFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bookedTimes, setBookedTimes] = useState<Date[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (selectedDate) {
      getBookedTimes(selectedDate).then(setBookedTimes);
    }
  }, [selectedDate]);

  const isValidDate = (date: string) => {
    const selectedDate = new Date(date);
    const day = selectedDate.getDay();
    return day >= 0 && day <= 6; // 0 (Sunday) to 6 (Saturday)
  };

  const generateTimeOptions = () => {
    const times: string[]  = [];
    const selectedDay = selectedDate ? new Date(selectedDate).getDay() : -1;
    
    // Return empty array if no date selected
    if (selectedDay === -1) return times;
    
    // Set office hours based on the day
    let startHour = 8;  // Default start time
    let endHour = 17;   // Default end time
    
    // Special hours for Sunday (half day)
    if (selectedDay === 0) { // Sunday
      endHour = 12; // Half day until noon
    }
    
    // Generate time slots based on the day
    if (selectedDay >= 1 && selectedDay <= 6) { // Monday to Saturday
      for (let hour = startHour; hour < endHour; hour++) {
        if (hour === 12) continue; // Skip 12 PM (lunch break)
        for (let minute = 0; minute < 60; minute += 15) {
          const time = new Date(2000, 0, 1, hour, minute);
          times.push(time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }));
        }
      }
    } else if (selectedDay === 0) { // Sunday (half day)
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const time = new Date(2000, 0, 1, hour, minute);
          times.push(time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }));
        }
      }
    }
    
    return times;
  };

  const isTimeBooked = (time: string) => {
    const [hours, minutes] = time.split(':');
    let hourNum = parseInt(hours, 10);
    const period = time.slice(-2).toLowerCase();
    
    if (period === 'pm' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'am' && hourNum === 12) {
      hourNum = 0;
    }
    
    return bookedTimes.some(bookedTime => 
      bookedTime.getHours() === hourNum && 
      bookedTime.getMinutes() === parseInt(minutes, 10)
    );
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    setSearchTerm(pet.name);
    setValue('petId', pet.id.toString());
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    if (e.target.value === '') {
      setSelectedPet(null);
      setValue('petId', '');
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    if (!isValidDate(data.date)) {
      toast.error('Please select a valid business day');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const result = await createAppointment({ success: false, error: null }, formData);
      if (result.success) {
        toast.success('Appointment created successfully!');
        reset();
        setSelectedPet(null);
        setSearchTerm('');
        onClose();
      } else {
        toast.error(result.error || 'Failed to create appointment');
      }
    } catch (error) {
      toast.error('An error occurred while creating the appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="petSearch">Pet</Label>
        <Input
          type="text"
          id="petSearch"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a pet"
        />
        {showSuggestions && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <li
                  key={pet.id}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                  onClick={() => handlePetSelect(pet)}
                >
                  {pet.name}
                </li>
              ))
            ) : (
              <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-700">
                No pets found
              </li>
            )}
          </ul>
        )}
        <input type="hidden" {...register("petId")} value={selectedPet?.id || ''} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceId">Service</Label>
        <Select onValueChange={(value) => setValue('serviceId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id.toString()}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input type="date" id="date" {...register('date')} 
         onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Select onValueChange={(value) => setValue('time', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {generateTimeOptions().map((time) => (
              <SelectItem 
                key={time} 
                value={time}
                disabled={isTimeBooked(time)}
              >
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Appointment'}
      </Button>
    </form>
  );
}
