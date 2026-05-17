import React, { useState } from 'react'
import { useMediaQuery } from '../hooks/shared/useMediaQuery'
import { SidebarLayout } from './SidebarLayout'
import { SideSheet } from '../components/SideSheet'
import { BottomSheet } from '../components/BottomSheet'

const ui = 'p-2'

export type RenderTriggerProps = { onClick: () => void }
export type RenderContentProps = { trigger: React.ReactNode }

type PanelLayoutProps = {
  renderPanel: () => React.ReactNode
  renderContent: (props: RenderContentProps) => React.ReactNode
  renderTrigger: (props: RenderTriggerProps) => React.ReactNode
}

export const PanelLayout = ({ renderPanel, renderContent, renderTrigger }: PanelLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const isMobile = useMediaQuery('(max-width: 799px)')
  const isTablet = useMediaQuery('(min-width: 800px) and (max-width: 1007px)')
  const isDesktop = useMediaQuery('(min-width: 1008px)')

  const open = () => setIsOpen(true)

  if (isDesktop) return <SidebarLayout sidebar={renderPanel()} content={renderContent({ trigger: null })} />

  return (
    <div className={ui}>
      {renderContent({ trigger: renderTrigger({ onClick: open }) })}
      {isOpen && isTablet && <SideSheet open={isOpen} onOpenChange={setIsOpen}>{renderPanel()}</SideSheet>}
      {isOpen && isMobile && <BottomSheet open={isOpen} onOpenChange={setIsOpen}>{renderPanel()}</BottomSheet>}
    </div>
  )
}
