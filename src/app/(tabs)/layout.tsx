import TabBar from "@/components/tab-bar";

export default function TabLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <div className="mb-20">
        {children}
      </div>
      <TabBar />
    </div>
  );
}