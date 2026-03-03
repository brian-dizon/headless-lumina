"use client";

import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to access your Lumina Vault</p>
                </div>
                <div className="flex justify-center">
                    <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-muted rounded-2xl" />}>
                        <SignIn
                            routing="path"
                            path="/sign-in"
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
