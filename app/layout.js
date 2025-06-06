import {Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Doctor Appointment",
  description: "Book and manage your doctor appointments easily.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
        baseTheme: dark,
      }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className}`}
      >
     <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with 💗 by Chethan</p>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
