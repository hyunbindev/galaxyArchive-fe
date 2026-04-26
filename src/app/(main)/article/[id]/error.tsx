'use client'

import GalaxyBackground from "@/components/background/GalaxyBackground";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {SearchIcon} from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import Link from "next/link";

export default function Error({ error, reset }: {
    error: Error & { digest?: string, response?: any };
    reset: () => void
}) {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <Card className="w-full max-w-md bg-background z-99">
                    <CardHeader>
                        <CardTitle className="text-2xl">Article not found</CardTitle>
                        <CardDescription>Oops! I'm lost in the galaxy. It seems the constellation you're searching for has vanished into a deep black hole, or perhaps it was never recorded in our archive.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InputGroup className="sm:w-3/4">
                            <InputGroupInput placeholder="Try searching for other articles" />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                    </CardContent>
                    <CardFooter className="flex-col items-start">
                        <CardDescription>
                            <Link className="text-right" href="/">Back to galaxyArchive home.</Link>
                        </CardDescription>
                    </CardFooter>
                </Card>
            </div>
        <GalaxyBackground/>
        </>
    )
}