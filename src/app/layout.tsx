import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from '@/components/NotificationProvider';
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
});
export const metadata: Metadata = {
  title: "Hue Homestay & Entertainment | Khám phá nét đẹp cố đô",
  description: "Nền tảng tìm kiếm, đặt phòng homestay và khám phá các địa điểm vui chơi sang trọng, đẳng cấp tại Huế.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
