import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageRenderer from '@/app/(frontend)/Components/PageRender'
import { Page } from '@/payload-types'
import { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
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
  const { slug } = params
  const { isEnabled: isDraft } = await draftMode()
  const page = await getPage(slug, isDraft)

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
  const { slug } = params
  const { isEnabled: isDraft } = await draftMode()
  const page = await getPage(slug, isDraft)

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} />
}

// Generate static paths for all published pages
export async function generateStaticParams() {
  const payload = await getPayload({ config })

  try {
    const pages = await payload.find({
      collection: 'pages',
      where: {
        status: {
          equals: 'published',
        },
        slug: {
          not_equals: 'home', // Exclude home page as it's handled by the root route
        },
      },
      limit: 100,
    })

    return pages.docs.map((page) => ({
      slug: page.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
