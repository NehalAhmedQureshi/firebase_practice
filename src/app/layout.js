import "./globals.css";
import Header from "@/component/Header";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata = {
  title: "FaceBook Clone",
  description: "Create by NehalAhmedQureshi.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
