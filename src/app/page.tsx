import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Services from "./components/Services"; 
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services/>
      <Footer />
    </>
  );
}
