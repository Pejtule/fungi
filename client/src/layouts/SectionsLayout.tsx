import { Hero, type HeroProps } from '../components/Hero'

export type SectionsLayoutProps = {
  hero: HeroProps
}

export const SectionsLayout = ({ hero }: SectionsLayoutProps) => (
  <div>
    <Hero {...hero} />
  </div>
)
