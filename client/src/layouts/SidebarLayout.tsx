import { Group, Panel, Separator } from 'react-resizable-panels'

const ui = {
  group: 'p-2',
  panel: 'bg-taupe-300 dark:bg-taupe-600 rounded-sm',
  separator: 'w-1.5 rounded-sm transition-colors hover:bg-blue-400/60 focus:outline-none',
}

type SidebarLayoutProps = {
  sidebar: React.ReactNode
  content: React.ReactNode
}

export const SidebarLayout = ({ sidebar, content }: SidebarLayoutProps) => {

  return (
    <Group className={ui.group}>
      <Panel defaultSize={25} className={ui.panel}>
        {sidebar}
      </Panel>

      <Separator className={ui.separator} />

      <Panel defaultSize={75} className={ui.panel}>
        {content}
      </Panel>
    </Group>
  )
}
