import { t } from '../t'

const ui = 'py-6 text-center text-sm text-zinc-600 dark:text-zinc-400 border-t'

export const Footer = () => (
  <footer role='contentinfo' className={ui}>
    <p>{t.footer.copyright}</p>
    <p>{t.footer.illustration}</p>
  </footer>
)
