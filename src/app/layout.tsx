import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Monetra — Smarter Money Management",
    description:
        "A modern finance platform to track income, manage expenses, organize transactions, and connect your bank accounts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", "font-sans", inter.variable)}
        >
            <body className="min-h-full flex flex-col">
                <ClerkProvider>
                    <QueryProvider>{children}</QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
