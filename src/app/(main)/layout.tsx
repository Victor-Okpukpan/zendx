import Navbar from "@/components/ui/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Navbar />
      {children}
    </div>
  );
}
