import { useRouteError, Link } from 'react-router-dom'
import { t } from '../t'
import { InfoLayout } from '../layouts/InfoLayout'

const ui = {
  container: 'flex flex-col items-center justify-center p-8 text-center',
  title: 'text-xl md:text-3xl font-semibold mb-4',
  description: 'text-gray-600 mb-6',
  actions: 'flex gap-4 mb-8',
  retryAction: 'px-4 py-2 bg-blue-600 text-white rounded shadow-lg',
  backAction: 'px-4 py-2 bg-gray-300 rounded shadow-lg',
  details: 'text-left max-w-lg ',
  summary: 'cursor-pointer text-gray-500',
  pre: 'mt-2 p-4 bg-gray-100 text-black rounded text-sm overflow-auto whitespace-pre-wrap'
}


export const RootError = () => {
  const error = useRouteError()

  const infoLayout = {
    info: (
      <div className={ui.container}>
        <h1 className={ui.title}>{t.errors.root.title}</h1>
        <p className={ui.description}>{t.errors.root.description}</p>

        <div className={ui.actions}>
          <button onClick={() => location.reload()} className={ui.retryAction}>{t.errors.root.retry}</button>
          <Link to="/" className={ui.backAction}>{t.errors.root.backHome}</Link>
        </div>

        <details className={`${ui.details} min-h-28 overflow-y-auto`}>
          <summary className={ui.summary}>{t.errors.root.detailsSummary}</summary>
          <pre className={ui.pre}>{String(error)}</pre>
        </details>

      </div>
    ),
    image: <img src='./sadBasket.svg' className='short:max-h-35 max-h-40 md:max-h-70' />
  }

  return (
    <div className='flex flex-col min-h-screen'><InfoLayout {...infoLayout} /></div>
  )
}
