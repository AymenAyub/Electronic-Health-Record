"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HospitalHomePage({
  params,
}: {
  params: Promise<{ hospitalSubdomain: string }>;
}) {
  const { hospitalSubdomain } = use(params);
  const [hospital, setHospital] = useState<any>(null);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/hospital/getBySubdomain/${hospitalSubdomain}`
    )
      .then((res) => res.json())
      .then((data) => setHospital(data.hospital))
      .catch((err) => console.error("Error fetching hospital:", err));
  }, [hospitalSubdomain]);

  if (!hospital) return <div>Loading hospital info...</div>;

  return (
    <section className="relative min-h-screen w-full">
      {/* Hero Background Image */}
      <Image
        src="/doctorbg.png"
        alt="Hospital Background"
        fill
        className="object-cover -z-10"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 -z-10"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 text-white absolute top-0 w-full z-50">
        {/* Logo */}
        <div className="text-xl font-bold">{hospital.name}</div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6 text-md">
          <Link href="#" className="hover:text-blue-200">
            Home
          </Link>
          <Link href="#" className="hover:text-blue-200">
            About
          </Link>
          <Link href="#" className="hover:text-blue-200">
            Services
          </Link>
          <Link href="#" className="hover:text-blue-200">
            Contact
          </Link>
        </div>

        {/* Sign In Button */}
        <div>
          <Link
            href="/Login"
            className="px-6 py-3 bg-[#9bb2cd] text-[#0d0546] text-md font-medium rounded-xl shadow hover:bg-[#7a8ea5] transition"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-start text-left px-8 lg:px-20 py-32 space-y-4 max-w-3xl">
      <div className="max-w-3xl">
  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-snug">
    Leading the Way
    <span className="block text-blue-200">in Medical Excellence</span>
  </h1>

  <p className="mt-4 text-lg lg:text-xl text-[#0a2e58] tracking-wide">CARING FOR LIFE  </p>
</div>
        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <Link
            href="/Login"
            className="px-6 py-3 bg-[#9bb2cd] text-[#0d0546] text-md font-medium rounded-xl shadow hover:bg-[#7a8ea5] transition"
          >
            Sign In
          </Link>
          <Link
            href="#services"
            className="px-6 py-3 bg-[#9bb2cd] text-[#0d0546] text-md font-medium rounded-xl shadow hover:bg-[#7a8ea5] transition"
          >
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
