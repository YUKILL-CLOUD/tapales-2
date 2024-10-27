import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/ContactHero';
import Features from '@/components/Features';
import PetRehoming from '@/components/PetRehoming';
import { ServiceModal } from '@/components/ServiceModal';
import { DeleteServiceModal } from '@/components/DeleteServiceModal';
import { EditServiceModal } from '@/components/EditServiceModal';

export default async function ServicesPage() {
    const { userId } = auth();
    
    if (!userId) {
        return redirect('/sign-in');
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!dbUser) {
        return redirect('/sign-up');
    }

    const role = dbUser.role;
    const services = await prisma.service.findMany({
        orderBy: { name: 'asc' },
    });
    
    const rehomingPets = await prisma.rehomingPet.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container mx-auto px-4 py-8"> 
            <HeroSection/>
            <h1 className="text-3xl font-bold mb-6">Services</h1>
            {role === "admin" &&(
                <ServiceModal/> 
            )}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-4 rounded-md shadow-lg hover:shadow-xl shadow-md-mainColor-600 transition-all duration-300">
                        <h2 className="text-xl font-semibold mb-2 text-mainColor bg-mainColor-light">{service.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{service.description}</p>
                        <p className="font-bold text-mainColor bg-mainColor-light rounded-md p-1">Price: Php {service.price.toFixed(2)}+</p>
                        <p className="font-bold text-mainColor bg-mainColor-light rounded-md p-1">Duration: {service.duration} minutes</p>
                        {role === "admin" && (
                        <div className="mt-4 flex justify-end space-x-2">
                            <EditServiceModal service={service} />
                            <DeleteServiceModal service={service} />
                        </div>
                    )}
                    </div>
                ))}
            </div>
            <Features/>
            {/* <PetRehoming initialPets={rehomingPets} /> */}
        </div>
    );
}
