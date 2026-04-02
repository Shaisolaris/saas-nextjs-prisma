import type { Metadata } from "next";
export const metadata: Metadata = { title: "SaaS Email Platform", description: "Next.js + Prisma + Resend" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>{children}</body></html>;
}
