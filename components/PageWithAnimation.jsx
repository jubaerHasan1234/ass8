"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransitionWrapper({ children }) {
  const router = useRouter();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest("a[href]");
      if (link && link.href.startsWith(location.origin)) {
        e.preventDefault();
        const href = link.getAttribute("href");

        setAnimating(true); // trigger exit animation

        setTimeout(() => {
          router.push(href); // now route
        }, 400); // must match fade-out time
      }
    };

    document.body.addEventListener("click", handleLinkClick);
    return () => document.body.removeEventListener("click", handleLinkClick);
  }, []);

  useEffect(() => {
    setDisplayChildren(children);
    setAnimating(false); // start entry animation
  }, [children]);

  return (
    <div
      className={
        animating ? "animate-slide-up-fade" : "animate-slide-down-fade"
      }
    >
      {displayChildren}
    </div>
  );
}
