import React from 'react';

export default function ContactNumbers() {

    const contactsList = [
        {
            icon: (
                <svg
                    className="h-9 w-9  text-mainColor"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >   
                    <path d="M16.1007 13.359L16.5562 12.9062C17.1858 12.2801 18.1672 12.1515 18.9728 12.5894L20.8833 13.628C22.1102 14.2949 22.3806 15.9295 21.4217 16.883L20.0011 18.2954C19.6399 18.6546 19.1917 18.9171 18.6763 18.9651M4.00289 5.74561C3.96765 5.12559 4.25823 4.56668 4.69185 4.13552L6.26145 2.57483C7.13596 1.70529 8.61028 1.83992 9.37326 2.85908L10.6342 4.54348C11.2507 5.36691 11.1841 6.49484 10.4775 7.19738L10.1907 7.48257" stroke="#1C274C" stroke-width="1.5"/>
                    <path opacity="0.5" d="M18.6763 18.9651C17.0469 19.117 13.0622 18.9492 8.8154 14.7266C4.81076 10.7447 4.09308 7.33182 4.00293 5.74561" stroke="#1C274C" stroke-width="1.5"/>
                    <path opacity="0.5" d="M16.1007 13.3589C16.1007 13.3589 15.0181 14.4353 12.0631 11.4971C9.10807 8.55886 10.1907 7.48242 10.1907 7.48242" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            ),
            contact: "320 1383"
        },
        
        {
            icon: (
                <svg
                    className="h-9 w-9 text-mainColor"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="#000000" stroke-width="1.32" stroke-linecap="round" stroke-linejoin="round"/> <rect x="3" y="5" width="18" height="14" rx="2" stroke="#000000" stroke-width="1.32" stroke-linecap="round"/>
                </svg>
            ),
            contact: "info@example.com"
        }
    ];

    return (
        <section className='py-14 bg-gray-100'>
            <div className="max-w-screen-xl mx-auto px-4 gap-12 md:flex md:px-8">
                <div className='flex-1'>
                    <div className="max-w-lg">
                        <h3 className='font-semibold text-mainHover'>
                            Contact Information
                        </h3>
                        <p className='mt-3 text-gray-600 text-3xl font-extrabold sm:text-4xl'>
                            Get in touch with us
                        </p>
                    </div>
                </div>
                <div className='flex-1 mt-12 md:mt-0'>
                    <ul className='space-y-4 divide-y divide-gray-700'>
                        {contactsList.map((item, idx) => (
                            <li
                                className="py-5 flex items-center space-x-4"
                                key={idx}>
                                <div className="flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div className="text-gray-700">{item.contact}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}