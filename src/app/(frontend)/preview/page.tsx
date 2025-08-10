import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import PageRender from '../Components/PageRender'

export default async function PreviewHomePage() {
  console.log('🏠 Preview home page component called')

  const draft = await draftMode()
  console.log('🔍 Draft mode status:', draft.isEnabled)

  if (!draft.isEnabled) {
    console.log('❌ Preview mode not enabled')
    return <div>Preview mode not enabled</div>
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const page = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      limit: 1,
      draft: true,
    })

    console.log('📄 Home page found:', page.docs.length > 0)

    if (!page.docs || page.docs.length === 0) {
      console.log('❌ No page found')
      return <div>Page not found</div>
    }

    console.log('✅ Rendering home page with PageRender')
    return <PageRender page={page.docs[0]} />
  } catch (error) {
    console.error('❌ Error fetching preview page:', error)
    return (
      <div>
        Error loading preview page:{' '}
        {error instanceof Error ? error.message : 'An unknown error occurred'}
      </div>
    )
  }
}
