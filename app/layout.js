import "./globals.css";

export const metadata = {
  title: "ADMIN PANEL",
  description: "Secure Access Only",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
