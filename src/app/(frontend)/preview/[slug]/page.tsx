import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageRender from '../../Components/PageRender'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { isEnabled } = await draftMode()

  if (!isEnabled) {
    return <div>Preview mode not enabled</div>
  }

  try {
    const resolvedParams = await params
    const payload = await getPayload({ config })

    const page = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: resolvedParams.slug,
        },
      },
      limit: 1,
      draft: true,
    })

    if (!page.docs.length) {
      return <div>Page not found</div>
    }

    return <PageRender page={page.docs[0]} />
  } catch (error) {
    console.error('Preview page error:', error)
    return <div>Error loading preview</div>
  }
}
