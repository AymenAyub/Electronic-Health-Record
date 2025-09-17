import { Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 pt-28 lg:pt-32 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-start lg:space-x-10">
        
        {/* Left Side */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-snug">
            Advanced <span className="text-blue-500">Healthcare</span> <br /> Made Personal
          </h1>

          <p className="text-gray-600 leading-relaxed">
            <span className="text-blue-500 font-semibold">Streamlining Healthcare, One Click at a Time.</span> Manage hospitals, patients, and appointments with ease all from a 
            <span className="text-blue-500"> single, powerful platform.</span>Simplify workflows, improve efficiency, and deliver better care without the chaos of paperwork.
          </p>

          <div className="flex justify-center lg:justify-start">
            <a
              href="/signup"
              className="px-6 py-3 rounded-lg shadow text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 transition"
            >
              Join Now
            </a>
          </div>

          {/* Trusted By Logos */}
          <div className="pt-6">
            <p className="text-gray-500 text-sm">Trusted by millions across the globe:</p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mt-4 opacity-70">
              <Image src="/amazon.png" alt="Amazon" width={30} height={30} />
              <Image src="/apple.png" alt="Apple" width={30} height={30} />
              <Image src="/google.png" alt="Google" width={30} height={30} />
              <Image src="/notion.png" alt="Notion" width={30} height={30} />
              <Image src="/spotify.png" alt="Spotify" width={30} height={30} />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 relative flex justify-center items-center">
          {/* Background Circle */}
          <div className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-blue-100 -z-10"></div>

          {/* Rectangle Background as div */}
          <div
             className="absolute bottom-0 
             w-[300px] h-[320px]       
             lg:w-[380px] lg:h-[402px] 
             right-1/2 lg:right-20 
             transform -translate-x-1/2 lg:translate-x-0
             flex justify-center items-center z-10 
             bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: "url('/rectangle.png')" }}
          ></div>

          {/* Doctor Image */}
          <Image
            src="/doctor.png"
            alt="Doctor"
            width={482}
            height={476}
            className="relative z-10 object-contain max-w-[80%] sm:max-w-[60%] lg:max-w-full"
          />

          {/* Happy Customers Card */}
          <div className="absolute top-19 right-10 bg-white shadow-md rounded-lg p-3 flex flex-col items-center z-20">
            <p className="font-semibold text-sm">2400+</p>
            <p className="text-xs text-gray-500">Happy Customers</p>
            <p className="text-yellow-400 text-xs">★★★★☆ (4.7 Stars)</p>
          </div>

          {/* Easy Appointment Booking Card */}
          <div className="absolute bottom-10 left-2 bg-gradient-to-r from-white to-blue-300 shadow-md rounded-lg px-3 py-2 flex items-center space-x-2 z-20">
            <span className="text-blue-500"><Star /></span>
            <p className="text-xs font-medium">Easy Hospital Managing</p>
          </div>

          {/* NEW Bottom Right Card */}
          <div className="absolute -bottom-5 right-2 bg-gradient-to-r from-white to-blue-300 shadow-md rounded-lg px-3 py-4 flex items-center space-x-2 z-20">
            <span className="text-blue-500"><Star /></span>
            <p className="text-xs font-medium">Manage patients, appointments, and <br /> staff all in one secure platform.
</p>
          </div>
        </div>
      </div>
    </section>
  );
}
