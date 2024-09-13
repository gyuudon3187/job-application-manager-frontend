"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HttpStatus from "http-status-codes";
import { BASE_URL } from "@/utils/api";
import Loading from "./Loading";

async function fetchAuthStatus() {
  const response = await fetch(BASE_URL + "/authorize/", {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === HttpStatus.UNAUTHORIZED) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("Failed to fetch authentication status");
  }

  return response.json();
}

export const withoutAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return function WithoutAuth(props: P) {
    const router = useRouter();
    const { data, isLoading, error } = useQuery({
      queryKey: ["authStatus"],
      queryFn: fetchAuthStatus,
      refetchOnWindowFocus: false,
      retry: false,
    });

    useEffect(() => {
      if (!isLoading && data?.token) {
        router.push("/");
      }
    }, [isLoading, error, data, router]);

    if (isLoading) {
      return (
        <div className="flex h-[calc(100vh-128px)] w-full justify-center items-center">
          <Loading size={10} />
        </div>
      );
    }

    if (data?.token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return function WithAuth(props: P) {
    const router = useRouter();
    const { data, isLoading, error } = useQuery({
      queryKey: ["authStatus"],
      queryFn: fetchAuthStatus,
      refetchOnWindowFocus: false,
      retry: false,
    });

    useEffect(() => {
      if (!isLoading && (error || !data?.token)) {
        router.push("/login");
      }
    }, [isLoading, error, data, router]);

    if (isLoading) {
      return (
        <div className="flex h-[calc(100vh-128px)] w-full justify-center items-center">
          <Loading size={10} />
        </div>
      );
    }

    if (!data?.token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
