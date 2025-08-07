import Navbar from './components/Navbar'
import Hero from './components/Hero'

async function getNavigation() {
  const res = await fetch('http://localhost:3000/api/navigation', {
    next: { revalidate: 60 }, // Optional caching
  })
  const data = await res.json()
  return data.docs[0]
}

async function getHero() {
  const res = await fetch('http://localhost:3000/api/hero', {
    next: { revalidate: 60 },
  })
  const data = await res.json()
  return data.docs[0]
}

export default async function Page() {
  const navigation = await getNavigation()
  const hero = await getHero()

  return (
    <>
      <Navbar
        title={navigation.title}
        links={navigation.links}
        ctaLabel={navigation.ctaLabel}
        ctaUrl={navigation.ctaUrl}
      />
      <Hero heading={hero.heading} subheading={hero.subheading} image={hero.image} />
    </>
  )
}
