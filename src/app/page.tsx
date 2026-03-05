import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function Home() {
  return (
      <>
          <header className={"flex justify-between items-center p-2 bg-black/80"}>
              <h1 className={"text-white"}>galaxyArchive</h1>
              <div>
                  <Avatar>
                      <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                          className="grayscale"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
              </div>
          </header>
          <main>
              main
          </main>
          <footer>
              footer
          </footer>
      </>
  );
}
