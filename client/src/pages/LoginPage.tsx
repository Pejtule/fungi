import { useState } from 'react'
import { useUserActions } from '../hooks/useUser.ts'
import { cn } from '../helpers/cn'
import { Logo, useHeader } from '../layouts/Header.tsx'
import { Input } from '#components/Input.tsx'
import { Submit } from '#components/Submit.tsx'
import { FormError } from '#components/FormError.tsx'
import { t } from '../t'

const ui = {
  container: cn(
    'w-full h-full grid grid-rows-[auto_1fr]',
    'short:grid-rows-1'
  ),
  logo: 'short:hidden',
  content: 'flex items-center justify-center p-10',
  login: cn(
    'max-w-[400px] w-full',
    'short:bg-white short:dark:bg-zinc-800',
    'short:shadow-md dark:shadow-none',
    'short:rounded-xl short:p-6',
    'short:border short:border-gray-200 short:dark:border-zinc-700',
    'transition-colors'
  ),
  title: cn(
    'text-2xl font-semibold',
    'text-gray-900 dark:text-white',
    'mb-6 text-center'
  ),
  form: 'space-y-4'
}

export const LoginPage = () => {
  const { logo } = useHeader('public')
  const { email, password, submit, onSubmit, error } = useLogin()

  return (
    <div className={ui.container}>
      <div className={ui.logo}><Logo {...logo} /></div>
      <div className={ui.content}>

        <div className={ui.login}>
          <h1 className={ui.title}>{t.login.title}</h1>

          <form onSubmit={onSubmit} className={ui.form}>
            <Input {...email} />
            <Input {...password} />

            {error && <FormError error={error} />}

            <Submit {...submit} />
          </form>
        </div>

      </div>
    </div>
  )
}

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useUserActions()

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch {
      setError(t.login.errors.invalid)
    } finally {
      setLoading(false)
    }
  }

  const disabled = !email || !password || loading

  const controls = {
    email: {
      label: t.login.email,
      htmlFor: 'emailInput',
      input: {
        id: 'emailInput',
        type: 'email',
        value: email,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
        autoComplete: 'email'
      }
    },
    password: {
      label: t.login.password,
      htmlFor: 'passwordInput',
      input: {
        id: 'passwordInput',
        type: 'password',
        value: password,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
        autoComplete: 'current-password'
      }
    },
    submit: {
      label: t.login.submit,
      loadingLabel: t.login.loadingLabel,
      loading,
      disabled
    }
  }

  return { ...controls, onSubmit, loading, error }
}
