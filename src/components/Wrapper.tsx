export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1200px] mx-auto px-4 md:px-0">{children}</div>;
}
