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
            <div className="relative z-10 mt-1 h-5 w-5 rounded-full border-2 border-neutral-700 bg-neutral-950 timeline-dot" />
            <div className="flex-1">
        <h3 className="text-xl font-semibold">
          {experience.company}
        </h3>

        <p className="mt-1 text-neutral-400 font-display italic text-xl">
          {experience.job}
        </p>

        <span className="text-sm text-neutral-500 ">
          {experience.period}
        </span>

        <p className="mt-3 text-neutral-300 timeline-description max-w-3/5">
          {experience.description}
        </p>
      </div>

        </div>
    )
}