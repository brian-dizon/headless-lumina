"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, FormState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * SubmitButton Component
 * Uses useFormStatus to handle the loading state automatically.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="w-full h-12 rounded-xl font-bold transition-all" 
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Send Inquiry <Send className="h-4 w-4" />
        </span>
      )}
    </Button>
  );
}

export function ContactForm() {
  const initialState: FormState = {};
  const [state, formAction] = useActionState(submitLead, initialState);

  if (state.success) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-12 text-center space-y-4">
          <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for reaching out. A Lumina expert will review your inquiry and get back to you within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-xl overflow-hidden relative">
      <CardHeader className="bg-muted/30 pb-8">
        <CardTitle className="text-2xl font-black tracking-tight">Contact our Experts</CardTitle>
        <CardDescription>
          Have a specific technical challenge? Send us a message and our architectural team will reach out.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <form action={formAction} className="space-y-6">
          {/* General Error Message */}
          {state.error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g. Elena Vance" 
              className="h-12 rounded-xl"
              required 
            />
            {state.errors?.name && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="name@company.com" 
              className="h-12 rounded-xl"
              required 
            />
            {state.errors?.email && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Inquiry</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Briefly describe your project or challenge..." 
              className="min-h-[120px] rounded-xl resize-none"
              required 
            />
            {state.errors?.message && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{state.errors.message[0]}</p>
            )}
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
