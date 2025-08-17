import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageRenderer from '@/app/(frontend)/Components/PageRender'
import { Page } from '@/payload-types'
import { Metadata } from 'next'
import LenisProvider from '../Providers/LenisProvider'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getPage(slug: string, isDraft: boolean): Promise<Page | null> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
        ...(isDraft ? {} : { status: { equals: 'published' } }),
      },
      limit: 1,
      draft: isDraft,
      depth: 2, // This populates relationships like media uploads
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pageSlug = slug.join('/')
  const { isEnabled: isDraft } = await draftMode()
  const page = await getPage(pageSlug, isDraft)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const pageSlug = slug.join('/')
  const { isEnabled: isDraft } = await draftMode()
  const page = await getPage(pageSlug, isDraft)

  if (!page) {
    notFound()
  }

  return (
    <LenisProvider>
      <PageRenderer page={page} />
    </LenisProvider>
  )
}

// Generate static paths for all published pages
export async function generateStaticParams() {
  // Skip static generation during build to avoid database connection issues
  // Pages will be generated on-demand at runtime
  return []
}