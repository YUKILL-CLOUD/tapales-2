// 'use client'

// import * as Clerk from '@clerk/elements/common'
// import * as SignIn from '@clerk/elements/sign-in'
// import { useUser } from '@clerk/nextjs'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'

// export default function SignInPage() {

//   const {isLoaded, isSignedIn, user } = useUser()
//   const router = useRouter();
  

//   useEffect(() => {
//     const role = user?.publicMetadata.role;
    
//     if (role){
//       router.push(`/${role}`)
//     }
//   },[user,router ])
  
//   return (
//     <div className="grid w-full flex-grow items-center bg-white px-4 sm:justify-center">
//       <SignIn.Root>
//         <SignIn.Step
//           name="start"
//           className="w-full space-y-6 rounded-2xl px-4 py-10 sm:w-96 sm:px-8"
//         >
//           <header className="text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 40 40"
//               className="mx-auto size-10"
//             >
//               <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
//                 <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
//               </mask>
//               <g fill="#0A0A0A" mask="url(#a)">
//                 <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
//                 <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
//               </g>
//             </svg>
//             <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
//               Sign in to Tapales
//             </h1>
//           </header>
//           <Clerk.GlobalError className="block text-sm text-red-600" />
//           <Clerk.Field name="identifier">
//             <Clerk.Label className="sr-only">Email</Clerk.Label>
//             <Clerk.Input
//               type="email"
//               required
//               placeholder="Email"
//               className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
//             />
//             <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
//           </Clerk.Field>
//           <SignIn.Action
//             submit
//             className="relative w-full rounded-md bg-neutral-600 bg-gradient-to-b from-neutral-500 to-neutral-600 py-1.5 text-sm font-medium text-white shadow-[0_1px_1px_0_theme(colors.white/10%)_inset,0_1px_2.5px_0_theme(colors.black/36%)] outline-none ring-1 ring-inset ring-neutral-600 before:absolute before:inset-0 before:rounded-md before:bg-white/10 before:opacity-0 hover:before:opacity-100 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 active:bg-neutral-600 active:text-white/60 active:before:opacity-0"
//           >
//             Sign In
//           </SignIn.Action>
//           <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-neutral-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-white px-4 text-neutral-500">OR</span>
//             </div>
//           </div>
//           <div className="rounded-xl bg-neutral-100 p-5">
//             <div className="space-y-2">
//               <Clerk.Connection
//                 name="google"
//                 className="flex w-full items-center justify-center gap-x-3 rounded-md bg-gradient-to-b from-white to-neutral-50 px-2 py-1.5 text-sm font-medium text-neutral-950 shadow outline-none ring-1 ring-black/5 hover:to-neutral-100 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 active:text-neutral-950/60"
//               >
//                 <Clerk.Icon/>
//                 Sign in with Google
//               </Clerk.Connection>
//               <Clerk.Connection
//                 name="facebook"
//                 className="flex w-full items-center justify-center gap-x-3 rounded-md bg-gradient-to-b from-white to-neutral-50 px-2 py-1.5 text-sm font-medium text-neutral-950 shadow outline-none ring-1 ring-black/5 hover:to-neutral-100 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 active:text-neutral-950/60"
//               >
//                 <Clerk.Icon/>
//                 Sign in with Facebook
//               </Clerk.Connection>
//             </div>
//           </div>
//           <p className="text-center text-sm text-neutral-500">
//             Don&apos;t have an account?{' '}
//             <a
//               href="/sign-up"
//               className="rounded px-1 py-0.5 text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:bg-neutral-100"
//             >
//               Sign up
//             </a>
//           </p>
//         </SignIn.Step>
//         <SignIn.Step
//           name="verifications"
//           className="w-full space-y-6 rounded-2xl px-4 py-10 sm:w-96 sm:px-8"
//         >
//           <SignIn.Strategy name="email_code">
//             <header className="text-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 40 40"
//                 className="mx-auto size-10"
//               >
//                 <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
//                   <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
//                 </mask>
//                 <g fill="#0A0A0A" mask="url(#a)">
//                   <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
//                   <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
//                 </g>
//               </svg>
//               <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
//                 Verify email code
//               </h1>
//             </header>
//             <Clerk.GlobalError className="block text-sm text-red-600" />
//             <Clerk.Field name="code">
//               <Clerk.Label className="sr-only">Email code</Clerk.Label>
//               <Clerk.Input
//                 type="otp"
//                 required
//                 placeholder="Email code"
//                 className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
//               />
//               <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
//             </Clerk.Field>
//             <SignIn.Action
//               submit
//               className="relative w-full rounded-md bg-neutral-600 bg-gradient-to-b from-neutral-500 to-neutral-600 py-1.5 text-sm text-white shadow-[0_1px_1px_0_theme(colors.white/10%)_inset,0_1px_2.5px_0_theme(colors.black/36%)] outline-none ring-1 ring-inset ring-neutral-600 before:absolute before:inset-0 before:rounded-md before:bg-white/10 before:opacity-0 hover:before:opacity-100 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 active:bg-neutral-600 active:text-white/60 active:before:opacity-0"
//             >
//               Continue
//             </SignIn.Action>
//           </SignIn.Strategy>
//           <SignIn.Strategy name="phone_code">
//             <header className="text-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 40 40"
//                 className="mx-auto size-10"
//               >
//                 <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
//                   <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
//                 </mask>
//                 <g fill="#0A0A0A" mask="url(#a)">
//                   <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
//                   <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
//                 </g>
//               </svg>
//               <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
//                 Verify phone code
//               </h1>
//             </header>
//             <Clerk.GlobalError className="block text-sm text-red-600" />
//             <Clerk.Field name="code">
//               <Clerk.Label className="sr-only">Phone code</Clerk.Label>
//               <Clerk.Input
//                 type="otp"
//                 required
//                 placeholder="Phone code"
//                 className="w-full border-b border-neutral-200 bg-white pb-2 text-sm/6 text-neutral-950 outline-none placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-600 data-[invalid]:border-red-600 data-[invalid]:text-red-600"
//               />
//               <Clerk.FieldError className="mt-2 block text-xs text-red-600" />
//             </Clerk.Field>
//             <SignIn.Action
//               submit
//               className="relative w-full rounded-md bg-neutral-600 bg-gradient-to-b from-neutral-500 to-neutral-600 py-1.5 text-sm text-white shadow-[0_1px_1px_0_theme(colors.white/10%)_inset,0_1px_2.5px_0_theme(colors.black/36%)] outline-none ring-1 ring-inset ring-neutral-600 before:absolute before:inset-0 before:rounded-md before:bg-white/10 before:opacity-0 hover:before:opacity-100 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 active:bg-neutral-600 active:text-white/60 active:before:opacity-0"
//             >
//               Login
//             </SignIn.Action>
//           </SignIn.Strategy>
//           <p className="text-center text-sm text-neutral-500">
//             Don&apos;t have an account?{' '}
//             <a
//               href="/sign-up"
//               className="rounded px-1 py-0.5 text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:bg-neutral-100"
//             >
//               Sign up
//             </a>
//           </p>
//         </SignIn.Step>
//       </SignIn.Root>
//     </div>
//   )
// }

'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
  const {isLoaded, isSignedIn, user } = useUser()
  const router = useRouter();
  
  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role){
      router.push(`/${role}`)
    }
  },[user,router ])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="bg-white rounded-lg shadow-md p-8 space-y-6"
          >
            <header className="text-center">
              <h1 className="text-2xl font-bold text-mainColor-700 mb-2">
                Welcome Back
              </h1>
              <h1 className="text-4xl font-bold text-mainColor-700 mb-2">
                To Tapales Clinic
              </h1>
              <p className="text-gray-500 text-sm">Sign in to your account</p>
            </header>

            <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 p-3 rounded" />

            <div className="space-y-4">
              <Clerk.Field name="identifier">
                <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor-500 focus:border-transparent"
                />
                <Clerk.FieldError className="mt-1 text-xs text-red-600" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="w-full bg-mainColor-600 text-white py-2 px-4 rounded-md hover:bg-mainColor-700 transition-colors duration-200"
              >
                Sign In
              </SignIn.Action>
            </div>

            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <Clerk.Connection
                name="google"
                className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <Clerk.Icon />
                Sign in with Google
              </Clerk.Connection>

              <Clerk.Connection
                name="facebook"
                className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <Clerk.Icon />
                Sign in with Facebook
              </Clerk.Connection>
            </div> */}

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <a
                href="/sign-up"
                className="text-mainColor-600 hover:text-mainColor-700 font-medium"
              >
                Sign up
              </a>
            </p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  )
}