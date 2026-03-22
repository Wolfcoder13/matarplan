import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
