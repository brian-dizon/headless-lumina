"use client";

import dynamic from "next/dynamic";

const Assistant = dynamic(() => import("./Assistant").then(mod => mod.Assistant), {
  ssr: false,
});

export function ClientAssistant() {
  return <Assistant />;
}
