import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "VidyaPath — 12th se Masters tak, Full Free Preparation",
  description: "Ek hi platform par 12th, BCA, MCA, UPSC — sab kuch, sab free.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
