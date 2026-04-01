import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Film, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { ID } from 'appwrite';

// Shadcn Primitives
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Backend & State
import { account } from '@/lib/appwriteConfig';
import useAuthStore from '@/store/Auth';
import PageTransition from '@/components/PageTransition';

export default function SignupPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [globalError, setGlobalError] = useState('');

  // 1. Initialize TanStack Form with Zod Adapter
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setGlobalError('');
      try {
        // Step 1: Create the actual user in the Appwrite Database
        // Appwrite requires a unique ID, Email, Password, and (optional) Name
        await account.create({userId: ID.unique(),email: value.email,password: value.password,name: value.name});
        
        // Step 2: Automatically log them in so they don't have to re-type it
        await account.createEmailPasswordSession({email: value.email, password: value.password});
        
        // Step 3: Fetch their newly minted user data
        const userData = await account.get();
        
        // Step 4: Hydrate Zustand and send them to the catalog!
        login(userData);
        navigate('/');
        
      } catch (error) {
        console.error("Signup failed:", error);
        setGlobalError(error.message || "Could not create account. Please try again.");
      }
    },
  });

  return (
    <PageTransition>
      <div className="w-full min-h-screen grid lg:grid-cols-2 bg-zinc-950">
        
        {/* --- LEFT SIDE: The Cinematic Poster --- */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
          <div className="absolute inset-0">
            {/* Different poster for signup to distinguish the pages */}
            <img 
              src="https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg" 
              alt="Cinematic Backdrop" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/20 to-zinc-950"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
            <Film className="w-8 h-8 text-red-600 fill-red-600" />
            VidKing
          </div>

          <div className="relative z-10 max-w-lg">
            <blockquote className="space-y-6">
              <p className="text-3xl font-bold text-white leading-tight drop-shadow-lg">
                "Your universe of cinema awaits. Claim your front-row seat today."
              </p>
              <footer className="text-zinc-400 text-sm font-medium">VidKing Cinematic OS v2.0</footer>
            </blockquote>
          </div>
        </div>

        {/* --- RIGHT SIDE: The TanStack Form --- */}
        <div className="flex items-center justify-center px-8 sm:px-12 py-[50px] overflow-y-auto">
          <div className="w-full max-w-[400px] space-y-8">
            
            <div className="flex flex-col space-y-2 text-center w-full items-center">
              <div className="flex lg:hidden items-center justify-center gap-2 text-white font-black text-2xl tracking-tighter mb-4">
                <Film className="w-8 h-8 text-red-600 fill-red-600" /> VidKing
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
              <p className="text-sm text-zinc-400">
                Enter your details below to start building your library.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                
                {/* NAME FIELD */}
                <form.Field
                  name="name"
                  validators={{
                    onBlur: z.string().min(2, "Name must be at least 2 characters."),
                  }}
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-zinc-300">Full Name</Label>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="John Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-red-600 focus-visible:border-red-600 h-12"
                      />
                      <div className="h-5">
                        {field.state.meta.isDirty && field.state.meta.errors.length > 0 ? (
                          <motion.p initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="text-[13px] text-red-500 font-medium leading-tight">
                            {field.state.meta.errors.map((err) => typeof err === 'string' ? err : err.message).join(", ")}
                          </motion.p>
                        ) : null}
                      </div>
                    </div>
                  )}
                />

                {/* EMAIL FIELD */}
                <form.Field
                  name="email"
                  validators={{
                    onBlur: z.string().email("Please enter a valid email address."),
                  }}
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-zinc-300">Email</Label>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="name@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-red-600 focus-visible:border-red-600 h-12"
                      />
                      <div className="h-5">
                        {field.state.meta.isDirty && field.state.meta.errors.length > 0 ? (
                          <motion.p initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="text-[13px] text-red-500 font-medium leading-tight">
                            {field.state.meta.errors.map((err) => typeof err === 'string' ? err : err.message).join(", ")}
                          </motion.p>
                        ) : null}
                      </div>
                    </div>
                  )}
                />

                {/* PASSWORD FIELD */}
                <form.Field
                  name="password"
                  validators={{
                    onBlur: z.string().min(8, "Password must be at least 8 characters."),
                  }}
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-zinc-300">Password</Label>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-red-600 focus-visible:border-red-600 h-12"
                      />
                      <div className="h-5">
                        {field.state.meta.isDirty && field.state.meta.errors.length > 0 ? (
                          <motion.p initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} className="text-[13px] text-red-500 font-medium leading-tight">
                            {field.state.meta.errors.map((err) => typeof err === 'string' ? err : err.message).join(", ")}
                          </motion.p>
                        ) : null}
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Appwrite Global Error */}
              {globalError && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium">
                  {globalError}
                </div>
              )}

              {/* Submit Button */}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button 
                    type="submit" 
                    disabled={!canSubmit || isSubmitting}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...</>
                    ) : (
                      <>Sign Up <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                  </Button>
                )}
              />
            </form>

            <div className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-white hover:text-red-500 transition-colors">
                Sign in
              </Link>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}