import HeroSection from '@/components/ContactHero'
import ContactNumbers from '@/components/ContactInfo'
import ContactMap from '@/components/Map'
import React, { ReactNode } from 'react'

export default function Contact() {
    return (
        <div>
            <HeroSection/>
            <ContactMap/>
            <ContactNumbers/>
        </div>  
    )
}
