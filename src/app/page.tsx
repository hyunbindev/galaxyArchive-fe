import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function Home() {
  return (
      <>
          <header className={"flex justify-center items-center p-2 white"}>
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
          <main className={"bg-black h-[150vh]"}>
              <div className={"h-1/2"}>

              </div>
              <div className={"max-w-6xl mx-auto"}>
                  <Carousel>
                      <CarouselContent className="-ml-4">
                          <CarouselItem className="pl-4 basis-1/4">
                              <Card>
                                  <CardHeader>
                                      <CardTitle>Card Title</CardTitle>
                                      <CardDescription>Card Description</CardDescription>
                                      <CardAction>Card Action</CardAction>
                                  </CardHeader>
                                  <CardContent>
                                      <p>Card Content</p>
                                  </CardContent>
                                  <CardFooter>
                                      <p>Card Footer</p>
                                  </CardFooter>
                              </Card>
                          </CarouselItem>
                          <CarouselItem className="pl-4 basis-1/4">
                              <Card>
                                  <CardHeader>
                                      <CardTitle>Card Title</CardTitle>
                                      <CardDescription>Card Description</CardDescription>
                                      <CardAction>Card Action</CardAction>
                                  </CardHeader>
                                  <CardContent>
                                      <p>Card Content</p>
                                  </CardContent>
                                  <CardFooter>
                                      <p>Card Footer</p>
                                  </CardFooter>
                              </Card>
                          </CarouselItem>
                          <CarouselItem className="pl-4 basis-1/4">
                              <Card>
                                  <CardHeader>
                                      <CardTitle>Card Title</CardTitle>
                                      <CardDescription>Card Description</CardDescription>
                                      <CardAction>Card Action</CardAction>
                                  </CardHeader>
                                  <CardContent>
                                      <p>Card Content</p>
                                  </CardContent>
                                  <CardFooter>
                                      <p>Card Footer</p>
                                  </CardFooter>
                              </Card>
                          </CarouselItem>
                          <CarouselItem className="pl-4 basis-1/4">
                              <Card>
                                  <CardHeader>
                                      <CardTitle>Card Title</CardTitle>
                                      <CardDescription>Card Description</CardDescription>
                                      <CardAction>Card Action</CardAction>
                                  </CardHeader>
                                  <CardContent>
                                      <p>Card Content</p>
                                  </CardContent>
                                  <CardFooter>
                                      <p>Card Footer</p>
                                  </CardFooter>
                              </Card>
                          </CarouselItem>
                      </CarouselContent>
                  </Carousel>
              </div>
          </main>
          <footer className={"max-w-6xl mx-auto white h-[100vh]"}>
              <div className={"p-5"}>

              </div>
          </footer>
      </>
  );
}
