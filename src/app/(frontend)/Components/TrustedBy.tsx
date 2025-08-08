'use client'

import { Media, TrustedBy } from '@/payload-types'

type Props = {
  data: TrustedBy
}

export default function TrustedBySection({ data }: Props) {
  return (
    <section className="w-full px-4 py-16 text-center bg-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
        {data.preText}{' '}
        <span className="text-Teal text-2xl sm:text-3xl md:text-4xl font-bold">
          {data.highlightText}
        </span>{' '}
        {data.postText}
      </h2>

      {data.subtitle && <p className="text-gray-500 mt-2">{data.subtitle}</p>}
      <div className="mt-10 flex flex-wrap justify-center items-center gap-12">
        {data.logos?.map((item, idx) => {
          const logo = item?.logo as Media
          return (
            <img
              key={idx}
              src={logo?.url || ''}
              alt={`Logo ${idx + 1}`}
              className="h-10 sm:h-12 md:h-14 object-contain"
            />
          )
        })}
      </div>
    </section>
  )
}
