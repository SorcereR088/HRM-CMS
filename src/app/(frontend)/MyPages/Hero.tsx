'use client'

type HeroProps = {
  heading: string
  subheading: string
  image?: {
    url: string
  }
}

export default function Hero({ heading, subheading, image }: HeroProps) {
  return (
    <section className="w-full h-[80vh] flex flex-col items-center px-6 py-20 text-center bg-gradient-to-b from-white to-teal-100 overflow-hidden relative">
      <div className="max-w-4xl z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{heading}</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">{subheading}</p>
      </div>

      {image?.url && (
        <div className="absolute bottom-0 w-full h-[65%] overflow-hidden z-0">
          <img
            src={image.url}
            alt="Dashboard Preview"
            className="w-full max-w-6xl mx-auto h-full object-cover object-top px-6 sm:px-12 md:px-20 lg:px-0"
          />
        </div>
      )}
    </section>
  )
}
