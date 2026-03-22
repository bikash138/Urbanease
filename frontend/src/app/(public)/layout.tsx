import Footer from "@/components/common/Footer";
import PublicNavbar from "@/components/public/PublicNavbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicNavbar />
      {children}
      <Footer />
    </>
  );
}
