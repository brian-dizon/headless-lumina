import { Heading } from "./Heading";
import { Paragraph } from "./Paragraph";

type EditorBlock = {
  name: string;
  renderedHtml?: string | null;
  innerHTML?: string | null;
  attributes?: {
    level?: number;
    [key: string]: unknown;
  } | null;
};

export function BlockRenderer({ blocks }: { blocks: EditorBlock[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-2">
      {blocks.map((block, index) => {
        const html = block.innerHTML ?? block.renderedHtml ?? "";

        switch (block.name) {
          case "core/heading":
            return <Heading key={index} html={html} level={block.attributes?.level} />;
          
          case "core/paragraph":
            return <Paragraph key={index} html={html} />;

          case "core/quote":
            return (
              <blockquote 
                key={index}
                className="my-10 border-l-4 border-primary/30 pl-8 py-4 italic text-2xl text-slate-700 dark:text-slate-300 font-serif"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );

          default:
            // Fallback for unhandled blocks
            return (
              <div 
                key={index} 
                className="prose dark:prose-invert max-w-none mb-6" 
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            );
        }
      })}
    </div>
  );
}
