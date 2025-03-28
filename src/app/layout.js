import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Error from './error';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Facebook Clone",
  description: "A Facebook clone built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary fallback={<Error />}>
          <ReduxProvider>{children}</ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
