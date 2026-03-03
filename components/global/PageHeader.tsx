import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  as?: "h1" | "h2" | "h3";
}

export function PageHeader({ eyebrow, title, description, as = "h1" }: PageHeaderProps) {
  const HeadingTag = as;

  return (
    <header className="mb-12">
      <Badge variant="outline" className="mb-4 px-3 py-1 text-primary border-primary/20 bg-primary/5">
        {eyebrow}
      </Badge>
      <HeadingTag className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
        {title}
      </HeadingTag>
      <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {description}
      </p>
    </header>
  );
}
