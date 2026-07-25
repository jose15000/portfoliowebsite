"use client"

type props = {
    job: string,
    company: string,
    period: string,
    description: string,
    className?: string,
}


export function TimelineItem ({experience, className}: {className: string, experience: props} ) {

    return (
        <div className={`relative flex gap-8 ${className} `}>
            <div className="relative ml-1 md:ml-0 -10 mt-1 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-neutral-700 bg-neutral-950 timeline-dot" />
            <div className="flex-1">
        <h3 className="text-lg md:text-xl font-medium">
          {experience.job}
        </h3>

        <p className="mt-1 text-neutral-400 font-display italic text-xl">
          {experience.company}
        </p>

        <span className="text-sm text-neutral-500 ">
          {experience.period}
        </span>

        <p className="mt-3 text-neutral-300 timeline-description md:max-w-3/5 text-sm md:text-lg">
          {experience.description}
        </p>
      </div>

        </div>
    )
}