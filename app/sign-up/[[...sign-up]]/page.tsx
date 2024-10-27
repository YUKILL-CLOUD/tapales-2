'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp()
  const router = useRouter()

  const handleSignUp = async () => {
    if (!isLoaded) return

    try {
      if (signUp.status === 'complete') {
        await setActive({ session: signUp.createdSessionId })
        router.push('/redirect')
      }
    } catch (e) {
      console.error('Error during sign-up:', e)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6">
        <SignUp.Root>
          <SignUp.Step
            name="start"
            className="bg-white rounded-lg shadow-md p-8 space-y-6"
          >
            <header className="text-center">
              <h1 className="text-2xl font-bold text-mainColor-700 mb-2">
                Create an account
              </h1>
              <h1 className="text-4xl font-bold text-mainColor-700 mb-2">
                To Tapales Clinic
              </h1>
              <p className="text-gray-500 text-sm">Sign up to get started</p>
            </header>

            <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 p-3 rounded" />

            <div className="space-y-4">
              <Clerk.Field name="emailAddress">
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

              <Clerk.Field name="password">
                <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  placeholder="Create a password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor-500 focus:border-transparent"
                />
                <Clerk.FieldError className="mt-1 text-xs text-red-600" />
              </Clerk.Field>

              <SignUp.Action
                submit
                className="w-full bg-mainColor-600 text-white py-2 px-4 rounded-md hover:bg-mainColor-700 transition-colors duration-200"
              >
                Sign Up
              </SignUp.Action>
            </div>

            <div className="relative my-6">
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
                Sign up with Google
              </Clerk.Connection>

              <Clerk.Connection
                name="facebook"
                className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <Clerk.Icon />
                Sign up with Facebook
              </Clerk.Connection>
            </div>
          </SignUp.Step>
          <SignUp.Step
            name="verifications"
            className="bg-white rounded-lg shadow-md p-8 space-y-6"
          >
            <header className="text-center">
              <h1 className="mt-4 text-xl font-medium tracking-tight text-grey-500">
                Verify email code
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <SignUp.Strategy name="email_code">
              <Clerk.Field name="code" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-gray-500">Email code</Clerk.Label>
                <Clerk.Input
                  required
                  className="w-full rounded-md bg-mainColor-light px-3.5 py-2 text-sm text-gray-500 outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <SignUp.Action
                submit
                onClick={handleSignUp}
                className="relative isolate w-full rounded-md bg-mainColor-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
              >
                Finish registration
              </SignUp.Action>
            </SignUp.Strategy>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a
                href="/sign-in"
                className="text-mainColor-600 hover:text-mainColor-700 font-medium"
              >
                Sign in
              </a>
            </p>
          </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  )
}