import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {DialogOverlay} from "@/components/ui/dialog";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: PageProps){

    const resolvedParams = await searchParams;
    const redirectUrl = (resolvedParams.redirect as string) || '';

    const queryString = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : '';

    return(
        <div className="flex flex-col items-center justify-center h-screen backdrop-blur-[3px]">
            <Card className="w-full max-w-md bg-background z-99">
                <CardHeader>
                    <CardTitle className="text-2xl">GalaxyArchive</CardTitle>
                    <CardDescription>지금 GalaxyArchive에서 당신만의 성좌를 그려보세요.</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <a className="w-full" href={`/oauth2/authorization/github${queryString}`}>

                    <Button className="w-full">
                        Get started with GitHub
                    </Button>

                    </a>
                    <a className="w-full" href={`/oauth2/authorization/google${queryString}`}>
                    <Button className="w-full">
                        Get started with Google
                    </Button>
                    </a>
                </CardFooter>
            </Card>
        </div>
    )
}