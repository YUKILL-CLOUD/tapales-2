import Cta from '@/components/CTA'
import Faqs from '@/components/Faqs'
import HeroSection from '@/components/Hero'
import React, { ReactNode } from 'react'

export default function Home() {
    return (
        <div>
            <HeroSection/>
            <Cta/>
            <Faqs/>
        </div>  
    )
}
