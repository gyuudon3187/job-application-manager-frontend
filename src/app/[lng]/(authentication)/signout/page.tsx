"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../../_components/Loading";

export default function Signout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    router.replace("/");
  }, [router]);

  return <Loading />;
}
