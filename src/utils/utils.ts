import { headers } from "next/headers";

export function getAuthenticationStatusCSR() {
  return !!localStorage.getItem("token");
}

export function getAuthenticationStatusSSR() {
  const token = headers().get("authorization")?.split(" ", 2)[1];
  return !!token;
}
