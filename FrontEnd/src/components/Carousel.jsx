import {ArrowLeftIcon,ArrowRightIcon} from '@heroicons/react/24/outline'

import { useState, useEffect } from "react"
//import { ChevronLeft, ChevronRight } from "react-feather"

export default function Carousel({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0)

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [])
  return (
    <div className="overflow-hidden relative h-full rounded-lg">
      <div
        className="flex transition-transform ease-out duration-500 object-contain"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-blue-950/80 text-white hover:bg-white hover:text-blue-950"
        >
          <ArrowLeftIcon className='w-4 h-4' />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-blue-950/80 text-white hover:bg-white hover:text-blue-950"
        >
        <ArrowRightIcon className='w-4 h-4' />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides?slides.map((_, i) => (
            <div
              className={`
              transition-all w-3 h-3 bg-white rounded-full
              ${curr === i ? "p-2" : "bg-opacity-50"}
            `}
            />
          )):null}
        </div>
      </div>
    </div>
  )
}