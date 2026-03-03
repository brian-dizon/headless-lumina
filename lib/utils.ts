import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Proxies WordPress images through our first-party /cms-assets/ route
 * to strip third-party cookies and resolve Privacy Sandbox warnings.
 */
export function getProxyImage(url?: string | null) {
  if (!url) return "";
  
  // Replace remote hostname with our first-party proxy path
  const proxyPath = "/cms-assets/";
  const hostname = "lumina.briandizon.com";
  
  if (url.includes(hostname)) {
    return url.replace(`https://${hostname}/`, proxyPath);
  }
  
  return url;
}
