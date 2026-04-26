import {Header} from "@/components/header/Header";
import GalaxyBackground from "@/components/background/GalaxyBackground";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <Header/>
        {children}
        <GalaxyBackground/>
      </>
  );
}
