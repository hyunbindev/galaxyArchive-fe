import type { Metadata } from "next";
import "@/app/globals.css";
import {ThemeProvider} from "next-themes";


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="kr" suppressHydrationWarning>

        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "galaxyArchive",
    description: "당신의 기사들이 하나의 은하가 됩니다. 수천 개의 텍스트 데이터 사이의 맥락을 3D 그래프로 확인하고, 지식의 성단 속에서 숨겨진 연결성을 발견해 보세요.",
};
