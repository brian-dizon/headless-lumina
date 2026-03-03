"use client";

import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">Join Lumina Insights</h1>
                    <p className="text-muted-foreground">Create an account to unlock premium resources</p>
                </div>
                <div className="flex justify-center">
                    <Suspense fallback={<div className="h-[500px] w-full animate-pulse bg-muted rounded-2xl" />}>
                        <SignUp
                            routing="path"
                            path="/sign-up"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-background border-border shadow-sm shadow-slate-200/20 dark:shadow-slate-900/50 w-full",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                }
                            }}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
