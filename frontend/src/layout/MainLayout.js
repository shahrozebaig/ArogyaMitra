import Navbar from "../components/Navbar";
function MainLayout({ children }) {
  return (
    <div style={{ background: "#f0fdf4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}
export default MainLayout;