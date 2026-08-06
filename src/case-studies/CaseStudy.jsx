import { CaseHero } from './components/CaseHero'
import { CaseOverview } from './components/CaseOverview'
import { CaseProblem } from './components/CaseProblem'
import { CaseSolution } from './components/CaseSolution'
import { CaseDesignProcess } from './components/CaseDesignProcess'
import { CaseDevelopment } from './components/CaseDevelopment'
import { CaseFeatures } from './components/CaseFeatures'
import { CaseChallenges } from './components/CaseChallenges'
import { CaseResults } from './components/CaseResults'
import { CaseGallery } from './components/CaseGallery'
import { CaseTechnologies } from './components/CaseTechnologies'
import { CaseFuture, DraftBanner } from './components/CaseFuture'
import { CaseNav } from './components/CaseNav'
import { getCaseStudyNeighbours } from './data'

/**
 * One case study, top to bottom.
 *
 * A COMPOSITION ROOT, AND NOTHING ELSE
 * This file declares which sections appear and in what order. It holds no
 * layout, no copy and no data access beyond looking up the two neighbours for
 * the footer. Every section reads its own slice of the study and decides for
 * itself whether it has anything to show — which is why reordering the page is
 * reordering these lines, and why a project with no backend simply has no
 * Development section rather than needing a conditional here.
 *
 * The order is the argument: what it is, what was wrong, what was built, how it
 * was designed, how it was built, what it does, what resisted, what changed,
 * what it looks like, what it runs on, what comes next. A reader who stops
 * anywhere in that sequence has still read something complete.
 *
 * @param {object} props
 * @param {import('./data/schema').CaseStudy} props.study
 */
export function CaseStudy({ study }) {
  const { project } = study
  const { previous, next } = getCaseStudyNeighbours(project.slug)

  return (
    <article className="case-study">
      <CaseHero study={study} />

      {/* Shown, not hidden — a draft that looks finished is how a placeholder
          reaches a client. */}
      {study.draft && <DraftBanner title={project.title} />}

      <CaseOverview overview={study.overview} />
      <CaseProblem problem={study.problem} />
      <CaseSolution solution={study.solution} />
      <CaseDesignProcess design={study.design} />
      <CaseDevelopment development={study.development} />
      <CaseFeatures features={project.features} />
      <CaseChallenges challenges={study.challenges} />
      <CaseResults results={study.results} />
      <CaseGallery gallery={study.gallery} projectId={project.id} />
      <CaseTechnologies technologies={project.technologies} />
      <CaseFuture future={study.future} />

      <CaseNav previous={previous} next={next} />
    </article>
  )
}
