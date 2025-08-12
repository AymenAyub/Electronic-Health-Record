import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-blue-50 min-h-screen flex items-center">
      <div className="flex flex-col lg:grid lg:grid-cols-2 w-full">

        {/* Left Side */}
        <div className="flex flex-col justify-center items-center lg:items-start px-6 lg:px-20 space-y-6 min-h-screen lg:min-h-auto text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug">
            Advanced Healthcare <br /> Made Personal
          </h1>
          <p className="text-gray-600 max-w-md">
            Manage patients, appointments, and staff all in one secure platform.
            Designed for hospitals, clinics, and healthcare professionals.
          </p>
          <div className="flex space-x-4 justify-center lg:justify-start">
            <a 
            href="/Login"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
              Login
            </a>
            <a 
            href="/signup"
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition bg-transparent">
              Register Now
            </a>
          </div>
        </div>

        {/* Right Side - Single Full Image */}
        <div className="relative w-full h-[400px] lg:h-auto">
          <Image
            src="/heroimg.png"
            alt="Hospital"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
