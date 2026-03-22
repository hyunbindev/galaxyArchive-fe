import { ThemeModeToggle } from "@/components/theme/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
    return (
        <header className="sticky top-0 w-full flex justify-center items-center p-2 bg-white dark:bg-background backdrop-blur-md z-50 border-b border-border/50">
            <div className="max-w-6xl mx-auto flex justify-between items-center w-full">
                <h1 className="font-bold text-foreground">galaxyArchive</h1>
                <div className="flex items-center gap-4">
                    <ThemeModeToggle />
                    <Avatar className="h-8 w-8 border border-border/40">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                            className="grayscale hover:grayscale-0 transition-all"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-foreground">Hyunbin dev</div>
                </div>
            </div>
        </header>
    );
}