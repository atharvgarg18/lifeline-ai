import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LifeLineNavbar from "@/components/navbar/LifeLineNavbar";

export const metadata = {
  title: "LifeLine AI",
  description: "AI Powered Emergency Healthcare System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LifeLineNavbar>
            {children}
          </LifeLineNavbar>
        </AuthProvider>
      </body>
    </html>
  );
}