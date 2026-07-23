"use client";

import About from "@/components/About/About";
import { JourneyComponent } from "@/components/About/Journey";
import Nav from "@/components/Nav";

export default function AboutPage() {
    return(
        <>
        <Nav/>
        <div className="mx-auto">
        <About />
        <JourneyComponent/>
        </div>
        </>
        
    )
}