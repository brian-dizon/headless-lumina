import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-12">
      <Badge variant="outline" className="mb-4 px-3 py-1 text-primary border-primary/20 bg-primary/5">
        {eyebrow}
      </Badge>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {description}
      </p>
    </header>
  );
}
