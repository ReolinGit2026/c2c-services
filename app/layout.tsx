import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C2C Services | Local plumbing connections",
  description: "Tell C2C about your plumbing request or apply to join our local provider network.",
  metadataBase: new URL("https://c2cservices.co.za"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-ZA"><body>{children}</body></html>;
}
