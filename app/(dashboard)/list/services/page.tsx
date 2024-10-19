import HeroSection from '@/components/ContactHero'
import Features from '@/components/Features'
import PetRehoming from '@/components/PetRehoming'
import React, { ReactNode } from 'react'

export default function Services() {
    return (
        <div>
            <HeroSection/>
            <Features/>
            <PetRehoming/>
        </div>  
    )
}
