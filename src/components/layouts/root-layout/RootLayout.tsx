import "@/app/globals.css";
import type { Metadata } from "next";
import { RTLThemeProvider } from "@/components/rtl-layout/RTLThemeProvider";
import { TranslationProvider } from "@/providers/translation";
import MUIThemeProvider from "@/theme/ThemeContext";
import { ApolloWrapper } from "@/apollo-wrapper";
import { AlertProvider } from "@/providers/alert-provider/AlertProvider";
import { DialogProvider } from "@/providers/dialog-provider/DialogProvider";

export const metadata: Metadata = {
  title: "Check in/out",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RTLThemeProvider>
      <html lang="fa" dir="rtl">
        <body>
          <MUIThemeProvider>
            <TranslationProvider initialLocale="fa">
              <DialogProvider>
                <AlertProvider>
                  <ApolloWrapper>{children}</ApolloWrapper>
                </AlertProvider>
              </DialogProvider>
            </TranslationProvider>
          </MUIThemeProvider>
        </body>
      </html>
    </RTLThemeProvider>
  );
}
