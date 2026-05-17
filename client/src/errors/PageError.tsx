import { useRouteError } from 'react-router-dom'
import { Error } from './Error'

export const PageError = ({ notFound }: { notFound: React.ReactNode }) => {
  const error = useRouteError()
  if (error instanceof Response && error.status === 404) return notFound

  return <Error />
}
