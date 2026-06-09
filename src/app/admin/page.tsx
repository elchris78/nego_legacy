"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SomePage() {
  const router = useRouter();

  useEffect(() => {
    
    router.push("/admin/home");
  }, [router]); 

  return null; 
}
