import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface LinkProps {
  href: string;
  children: any;
}

export const CustomLink: React.FC<LinkProps> = ({ href, children }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const router = useRouter();

  const checkSelected = router.pathname === href;

  if (!show) return null;
  return (
    <Link passHref href={href}>
      <a
        href={href}
        className={`hover:opacity-100   ${
          checkSelected ? "opacity-100" : "opacity-60"
        }  hover:scale-95  
        
        `}
      >
        {children}
      </a>
    </Link>
  );
};

export default CustomLink;
