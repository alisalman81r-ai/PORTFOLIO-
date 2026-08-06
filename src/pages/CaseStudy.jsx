import { useParams } from 'react-router-dom'

import { CaseStudy, getCaseStudy } from '@/case-studies'
import { Seo } from '@/components/shared'
import NotFound from './NotFound'

/**
 * Case study route — `/work/:slug`.
 *
 * A composition root: resolve the slug, decide whether it exists, and render.
 * No layout, no data shaping, no styling.
 *
 * AN UNKNOWN SLUG RENDERS THE 404 PAGE RATHER THAN REDIRECTING
 * A redirect to `/` would tell the visitor nothing and lose the URL they were
 * given — which is usually a link someone shared with a typo, or a project that
 * has since been removed. Rendering the 404 in place keeps the address bar
 * honest and gives them the routes that do exist.
 *
 * The default export is what `React.lazy` expects, so this route can be
 * code-split from the router without any wrapper.
 */
export default function CaseStudyPage() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)

  if (!study) return <NotFound />

  const { project } = study

  return (
    <>
      <Seo
        title={project.title + ' — Case Study'}
        description={project.shortDescription}
      />
      <CaseStudy study={study} />
    </>
  )
}
