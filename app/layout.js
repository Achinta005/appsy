import "./globals.css";
import { AuthProvider } from "./context/authContext";

export const metadata = {
  title: "ADMIN PANEL",
  description: "Secure Access Only",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
