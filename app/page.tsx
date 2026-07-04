import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Nav />
      <main>
        <Hero />
        <div className="-z-10 inset-0 h-full w-full 
bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)] 
bg-size-[20px_20px]" >
          <About />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
