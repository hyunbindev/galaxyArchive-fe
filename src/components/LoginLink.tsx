'use client'

import {ReactNode} from "react";
import {LinkProps} from "next/dist/client/link";
import {usePathname, useSearchParams} from "next/dist/client/components/navigation";
import Link from "next/link";

interface LoginLinkProps extends Omit<LinkProps, 'href'> {
    children: ReactNode;
    className?: string;
}

export default function LoginLink({ children, className, ...props }: LoginLinkProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const queryString = searchParams.toString();
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

    const loginHref = `/login?redirect=${encodeURIComponent(currentUrl)}`;

    return (
        <Link href={loginHref} className={className} {...props}>
            {children}
        </Link>
    );
}