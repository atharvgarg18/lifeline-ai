import "@/styles/globals.css";
import LifeLineNavbar from "@/components/navbar/LifeLineNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LifeLineNavbar>
          {children}
        </LifeLineNavbar>
      </body>
    </html>
  );
}