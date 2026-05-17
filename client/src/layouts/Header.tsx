import React from 'react'
import { Link } from 'react-router-dom'
import { t } from '../t'
import { useDeviceCapabilities } from '../hooks/shared/useDeviceCapabilities'
import { useUser, useUserActions } from '../hooks/useUser'
import { cn } from '../helpers/cn'
import { Tooltip } from '../components/Tooltip'
import { ThemeToggle } from '../components/ThemeToggle'
import { KeyIcon } from '../components/icons/KeyIcon'
import { LogoutIcon } from '#components/icons/LogoutIcon.tsx'
import { HomeMushroomIcon } from '#components/icons/HomeMushroomIcon.tsx'
import type { User } from '../types/User'

const ui = {
  header: 'h-14 md:h-16 grid grid-cols-[auto_1fr] items-center gap-5 px-5',
  logo: 'w-max flex items-center gap-2 px-3 py-1 rounded-md focus:outline-none select-none',
  img: 'h-10 md:h-12 select-none',
  h1: 'text-2xl md:text-3xl font-quicksand font-bold select-none',
  actions: 'flex items-center justify-end gap-5',
  action: cn(
    'w-12 h-12 flex items-center justify-center p-2 rounded-md',
    'transition-colors focus:outline-none cursor-pointer [touch-action:manipulation] select-none'),

  focus: 'focus-visible:ring-1 focus-visible:ring-blue-400',
  hover: 'hover:bg-zinc-200/80 dark:hover:bg-zinc-700/20',
  active: 'active:bg-zinc-200/80 dark:active:bg-zinc-700/20',
}

export type HeaderLogo = {
  href: string
  label: string
  imgSrc: string
  imgAlt: string
}

export type HeaderAction = {
  id: string
  tooltip: string
  render: (classname: string) => React.ReactElement
}

export type HeaderProps = {
  logo: HeaderLogo
  actions: HeaderAction[]
}

export const Header = ({ logo, actions }: HeaderProps) => {
  const { isHoverable, usingKeyboard } = useDeviceCapabilities()

  return (
    <header role='banner' className={ui.header}>

      <Link to={logo.href} className={cn(ui.logo, usingKeyboard && ui.focus)}>
        <img src={logo.imgSrc} alt={logo.imgAlt} className={ui.img} />
        <h1 className={ui.h1}>{logo.label}</h1>
      </Link>

      <div className={ui.actions}>
        {actions.map(action => {
          if (isHoverable) {
            return (
              <Tooltip key={action.id} content={action.tooltip}>
                {action.render(cn(ui.action, ui.active, ui.hover, usingKeyboard && ui.focus))}
              </Tooltip>
            )
          }
          const element = action.render(cn(ui.action, ui.active, usingKeyboard && ui.focus))
          return React.cloneElement(element, { key: action.id })
        })}
      </div>

    </header>
  )
}

export type LogoProps = {
  href: string
  label: string
  imgSrc: string
  imgAlt: string
}

export const Logo = ({ href, label, imgSrc, imgAlt }: LogoProps) => {
  const { usingKeyboard } = useDeviceCapabilities()
  return (
    <Link to={href} className={cn(ui.logo, usingKeyboard && ui.focus)}>
      <img src={imgSrc} alt={imgAlt} className={ui.img} />
      <h1 className={ui.h1}>{label}</h1>
    </Link>
  )
}

export function useHeader(variant: 'admin' | 'public') {
  const { logout } = useUserActions()
  const { user } = useUser()

  const logo = {
    href: variant === 'public' ? '/mushrooms' : '/admin',
    label: t.name,
    imgSrc: '/mushrooms.svg',
    imgAlt: `${t.header.logo} ${t.name}`
  }

  const getAdminActions = (): HeaderAction[] => [
    {
      id: 'theme',
      tooltip: t.header.theme,
      render: className => (
        <ThemeToggle aria-label={t.header.theme} className={className} />
      )
    },
    {
      id: 'public',
      tooltip: t.header.public,
      render: className => (
        <Link to="/mushrooms" aria-label={t.header.public} className={className}>
          <HomeMushroomIcon aria-hidden="true" />
        </Link>
      )
    },
    {
      id: 'logout',
      tooltip: t.header.logout,
      render: className => (
        <button onClick={logout} aria-label={t.header.logout} className={className}>
          <LogoutIcon aria-hidden="true" />
        </button>
      )
    }
  ]


  const getPublicActions = (user: User | undefined) => {
    const actions = {
      theme: {
        id: 'theme',
        tooltip: t.header.theme,
        render: (className: string) => <ThemeToggle aria-label={t.header.theme} className={className} />
      },
      login: {
        id: 'login',
        tooltip: t.header.login,
        render: (className: string) => <Link to='/login' aria-label={t.header.login} className={className}><KeyIcon aria-hidden='true' /></Link>
      },
      admin: {
        id: 'admin',
        tooltip: t.header.admin,
        render: (className: string) => <Link to='/admin' aria-label={t.header.admin} className={className}><KeyIcon aria-hidden='true' /></Link>
      }
    }

    return [actions.theme, user ? actions.admin : actions.login]
  }

  const actions = variant === 'public' ? getPublicActions(user) : getAdminActions()

  return { logo, actions }
}
