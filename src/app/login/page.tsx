import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export default function LoginPage(){
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-backgorund">
            <Card className="w-full max-w-md bg-background">
                <CardHeader>
                    <CardTitle className="text-2xl">GalaxyArchive</CardTitle>
                    <CardDescription>지금 GalaxyArchive에서 당신만의 성좌를 그려보세요.</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <a className="w-full" href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`}>
                    <Button className="w-full cursor-pointer">
                        Join with GitHub
                    </Button>
                    </a>
                    <Button className="w-full cursor-pointer">
                        Join with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}