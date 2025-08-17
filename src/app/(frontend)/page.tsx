import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageRenderer from '@/app/(frontend)/Components/PageRender'
import { Page } from '@/payload-types'
import { Metadata } from 'next'
import LenisProvider from './Providers/LenisProvider'

async function getHomePage(isDraft: boolean): Promise<Page | null> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
        ...(isDraft ? {} : { status: { equals: 'published' } }),
      },
      limit: 1,
      draft: isDraft,
      depth: 2,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: isDraft } = await draftMode()
  const page = await getHomePage(isDraft)

  if (!page) {
    return {
      title: 'Home',
      description: 'Welcome to our website',
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  }
}

export default async function HomePage() {
  const { isEnabled: isDraft } = await draftMode()
  const page = await getHomePage(isDraft)

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Home page not found</h1>
          <p className="text-gray-600">Please create a page with slug &quot;home&quot; in your CMS.</p>
        </div>
      </div>
    )
  }

  return (
    <LenisProvider>
      <PageRenderer page={page} />
    </LenisProvider>
  )
}

export const revalidate = 0
