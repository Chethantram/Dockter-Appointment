import { getCurrentUser } from '@/actions/onboarding';
import { redirect } from 'next/navigation';
import React from 'react'

const OnboardingLayout =async ({children}) => {
    const user = await getCurrentUser();

    // Redirect users who have already completed onboarding
    if (user) {
      if (user.role === "PATIENT") {
        redirect("/docters");
      } else if (user.role === "DOCTOR") {
        // Check verification status for doctors
        if (user.verificationStatus === "VERIFIED") {
          redirect("/doctor");
        } else {
          redirect("/doctor/verification");
        }
      } else if (user.role === "ADMIN") {
        redirect("/admin");
      }
    }
  
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-transparent bg-clip-text mb-2">
              Welcome to HealthQueue
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell us how you want to use the platform
            </p>
          </div>
  
          {children}
        </div>
      </div>
    );
}

export default OnboardingLayout