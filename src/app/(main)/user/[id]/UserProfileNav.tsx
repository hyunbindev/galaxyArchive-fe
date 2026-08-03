"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

interface UserProfileNavProps {
    userId: string;
}

const navItems = [
    {href: "cluster", label: "Cluster"},
    {href: "article", label: "Articles"},
    {href: "activity", label: "Activity"},
];

export default function UserProfileNav({userId}: UserProfileNavProps) {
    const pathname = usePathname();

    return (
        <nav className="inline-flex h-9 w-fit items-center justify-center gap-1 bg-transparent p-[3px] text-muted-foreground">
            {navItems.map((item) => {
                const href = `/user/${userId}/${item.href}`;
                const isActive = pathname === href;

                return (
                    <Link
                        key={item.href}
                        href={href}
                        className={cn(
                            "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground",
                            "after:absolute after:inset-x-0 after:-bottom-1.25 after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity",
                            isActive && "text-foreground after:opacity-100"
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
