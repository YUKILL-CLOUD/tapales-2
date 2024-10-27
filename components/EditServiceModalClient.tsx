"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  duration: z.number().min(0, 'Duration must be a positive number'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export function EditServiceModalClient({ updateService, service }: { updateService: any, service: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service,
  });

  const onSubmit = async (data: ServiceFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append('id', service.id.toString());

    const result = await updateService({ success: false, error: null }, formData);
    if (result.success) {
      setIsOpen(false);
      reset();
      toast.success('Service updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update service. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('name')}
            placeholder="Service Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          
          <Textarea
            {...register('description')}
            placeholder="Description"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          
          <Input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="Price"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          
          <Input
            {...register('duration', { valueAsNumber: true })}
            type="number"
            step="1"
            placeholder="Duration"
          />
          {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
          <Button type="submit">Update Service</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}