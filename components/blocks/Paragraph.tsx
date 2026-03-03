export function Paragraph({ html }: { html: string }) {
  return <div className="text-muted-foreground leading-relaxed mb-6 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />;
}
