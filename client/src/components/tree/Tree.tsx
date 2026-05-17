import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRightIcon } from '#components/icons/ChevronRightIcon.tsx'
import { cn } from '../../helpers/cn'
import type { Node, TreeNodeBase } from './types'


export const Tree = <T,>(props: TreeNodeBase<T>) => {
  const { children: roots } = props.getChildren('roots')
  return (
    <ul className='py-3'>
      {roots.map((root) => (
        <li key={root.id}>
          <TreeNode {...{ ...props, node: root, depth: 0, root: true }} />
        </li>
      ))}
    </ul>
  )
}

export type TreeNodeProps<T> = TreeNodeBase<T> & {
  node: Node<T>
  depth: number
  root?: boolean
}

export const TreeNode = <T,>(props: TreeNodeProps<T>) => {
  const { node, renderNode, state, getChildren, onAction, depth, root = false } = props
  const { id, hasChildren } = node
  const { expanded, selected, toggle, select } = state
  const isExpanded = expanded.includes(id)
  const isSelected = selected.includes(id)

  const { children } = isExpanded ? getChildren(id) : { children: [] }

  const handleClick = () => {
    select(node)
    onAction?.(node)
  }

  const ui = {
    title: 'flex text-lg font-semibold py-1 mb-2 border-b',
    indentation: cn(
      'flex items-center pl-[calc(var(--depth)*1.2rem)] pr-3 py-0.5',
      isSelected && 'bg-purple-400/30 transition-colors'
    ),
    expander: 'w-12 h-12 md:w-7 md:h-7 flex items-center justify-center p-2 rounded-md',
    expanderIcon: cn(
      isExpanded && children.length > 0 && 'rotate-90',
      'transition-transform duration-200'
    ),
    label: cn(!hasChildren && 'pl-5', 'flex-1'),
  }

  return (
    <>
      <div
        className={root ? ui.title : ui.indentation}
        style={{ '--depth': depth } as React.CSSProperties}
      >
        {hasChildren && (
          <button onClick={() => toggle(id)} className={ui.expander}>
            <ChevronRightIcon className={ui.expanderIcon} />
          </button>
        )}

        <div className={ui.label} onClick={handleClick}>
          {renderNode(node)}
        </div>
      </div>

      {/* ⭐ ANIMACE CHILDREN */}
      <AnimatePresence initial={false}>
        {isExpanded && children.length > 0 && (
          <motion.ul
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children.map((child) => (
              <li key={child.id}>
                <TreeNode
                  {...props}
                  node={child}
                  depth={depth + 1}
                  root={false}
                />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  )
}

export function TreeNodeSkeleton({ depth }: { depth: number }) {
  return (
    <div
      className="flex items-center gap-2 pl-[calc(var(--depth)*1.2rem)] pr-3 py-1 animate-pulse"
      style={{ '--depth': depth } as React.CSSProperties}
    >
      <div className="w-4 h-4 rounded bg-gray-300/40" />
      <div className="h-3 w-24 rounded bg-gray-300/40" />
    </div>
  )
}
