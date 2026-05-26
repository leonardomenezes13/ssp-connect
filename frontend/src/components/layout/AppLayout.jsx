import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
