import Navbar from "../components/Navbar";
function MainLayout({ children }) {
  return (
    <div className="flex bg-[#0f111a] text-white min-h-screen font-['Inter']">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
export default MainLayout;