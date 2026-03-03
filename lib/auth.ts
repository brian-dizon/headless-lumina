export function getAuthToken() {
  const username = process.env.WORDPRESS_AUTH_USER;
  const password = process.env.WORDPRESS_AUTH_PASS;

  if (!username || !password) {
    console.warn("Auth credentials are missing. Please set WORDPRESS_AUTH_USER and WORDPRESS_AUTH_PASS in your environment variables.");
    return undefined;
  }

  // Base64 encode the credentials in the format "username:password"
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return token;
}
