import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/providers/SessionProvider";

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
        <Providers>
          <AuthProvider>
            <Navbar>
              {children}
            </Navbar>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}