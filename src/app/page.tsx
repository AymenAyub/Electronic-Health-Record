import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Services from "./components/Services"; 
export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <Hero />
      <Services/>
      <Footer />
    </div>
  );
}
