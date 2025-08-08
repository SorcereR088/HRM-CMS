import Hero from './MyPages/Hero'
import TrustedBy from './Components/TrustedBy'

async function getHero() {
  const res = await fetch('http://localhost:3000/api/hero', {
    next: { revalidate: 60 },
  })
  const data = await res.json()
  return data.docs[0]
}

async function getTrustedBy() {
  const res = await fetch('http://localhost:3000/api/trusted-by', {
    next: { revalidate: 60 },
  })
  const data = await res.json()
  return data.docs[0] // or return all if you want a list
}

export default async function Page() {
  const hero = await getHero()
  const trustedBy = await getTrustedBy()

  return (
    <>
      <Hero heading={hero.heading} subheading={hero.subheading} image={hero.image} />

      <TrustedBy data={trustedBy} />
    </>
  )
}
