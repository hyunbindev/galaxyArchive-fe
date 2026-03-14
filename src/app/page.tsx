import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import GalaxyNetwork from "@/app/test/page";

export default function Home() {
  return (
      <>
          <header className={"fixed w-full flex justify-center items-center p-2 bg-white backdrop-blur-md"}>
              <div className={"max-w-6xl mx-auto flex justify-between items-center w-full"}>
              <h1 className={"black"}>galaxyArchive</h1>
                  <div className={"flex items-center gap-4"}>
                      <Avatar>
                          <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                              className="grayscale"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className={"black"}>Hyunbin dev</div>
                  </div>
              </div>
          </header>
          <main>
              <GalaxyNetwork/>
          </main>
      </>
  );
}
