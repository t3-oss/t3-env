"use client";

import { ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";

const useIntersecting = (elemId: string, threshold = 1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elem =
    typeof document !== "undefined" ? document.getElementById(elemId) : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries[0].isIntersecting);
      },
      { threshold },
    );

    if (elem) {
      observer.observe(elem);
    }

    return () => {
      observer.disconnect();
    };
  }, [elem, threshold]);

  return isIntersecting;
};

export const ContinueDownButton = () => {
  const isIntersecting = useIntersecting("introduction");
  if (isIntersecting) return null;

  return (
    <ArrowDownCircle
      className="animate-bounce size-16 absolute right-1/2 translate-x-1/2 bottom-16 cursor-pointer"
      onClick={() => {
        document
          .getElementById("introduction")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    />
  );
};
