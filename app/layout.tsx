<<<<<<< HEAD
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
=======
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "LifeLine AI",
  description: "AI Powered Emergency Healthcare System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
>>>>>>> 95808d93ec68b65ea942c3dd0d01b1cd2674788e
