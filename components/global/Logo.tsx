import Link from "next/link";
import { Lightbulb } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group transition-all duration-300">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-colors" />
        <div className="relative bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-900/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          Lumina
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase ml-0.5">
          Insights
        </span>
      </div>
    </Link>
  );
}
