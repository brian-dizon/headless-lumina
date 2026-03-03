import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function GatedContent() {
  return (
    <div className="relative py-20 px-8 border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5 text-center overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

      <div className="relative z-10 max-w-md mx-auto space-y-6">
        <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary/20 animate-bounce">
          <Lock className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">This resource is for Members Only</h2>

        <p className="text-muted-foreground leading-relaxed">Join the Lumina Insights community to unlock our full archive of reports, engineering guides, and architectural blueprints.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="rounded-full px-8 font-bold w-full sm:w-auto">
              Create Free Account
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="rounded-full px-8 font-bold w-full sm:w-auto">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
