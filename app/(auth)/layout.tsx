import Logo from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In To Transcrire",
  description: "Sign in to enjoy full features on transcrire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center space-y-5">
      <Logo />
      {children}
    </main>
  );
}
