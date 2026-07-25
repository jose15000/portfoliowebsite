import Hero from "@/components/Hero";
import About from "@/components/About/About";
import Projects from "@/components/Projects";
import { JourneyComponent } from "@/components/About/Journey";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
         <About />
          <JourneyComponent/>
          <Projects/>
      </main>
    </div>
  );
}
