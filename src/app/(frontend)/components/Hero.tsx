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
    <section className="text-center mt-20 px-4">
      <h1 className="text-4xl font-bold text-gray-900">{heading}</h1>
      <p className="mt-4 text-xl text-gray-600">{subheading}</p>
      {image?.url && (
        <img src={image.url} alt="Hero Image" className="mx-auto mt-10 rounded-xl shadow-md" />
      )}
    </section>
  )
}
