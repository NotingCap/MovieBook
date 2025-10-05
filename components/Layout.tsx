import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 MovieBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}