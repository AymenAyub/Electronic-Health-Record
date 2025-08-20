import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="HealthPoint Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-blue-500 hover:text-blue-700">MediNex</span>
          </div>

          {/* Navbar */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-gray-700 hover:text-blue-500 transition">
              Services
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-500 transition">
              About
            </Link>
             <a href="/" className="text-gray-700 hover:text-blue-500 transition">
              Home
            </a>
            <Link href="#" className="text-gray-700 hover:text-blue-500 transition">
              Contact
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <a
              href="/Login"
              className="px-4 py-2 border bg-white border-blue-500 text-blue-500 rounded-lg hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:text-white transition"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
