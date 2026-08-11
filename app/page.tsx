import Hero from "@/components/Hero";
import About from "@/components/About/About";
import Projects from "@/components/Projects";
import { JourneyComponent } from "@/components/About/Journey";
import TubeList from "@/components/Tubelist";
import { Chat } from "@/components/Chat/chat";

export default function Home() {
  return (
    <div>
      <div className="w-full max-w-6xl mt-20 md:mt-0 mx-auto px-6 md:px-12 pb-4 md:pb-10 flex flex-col gap-32">
        <Hero />
         <About />
          <JourneyComponent/>
          <Projects/>
          <Chat/>
      </div>
    </div>
  );
}
