import type { ReactNode } from 'react'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { label: 'Projects', icon: '▦' },
  { label: 'Devboxes', icon: '▣' },
  { label: 'Previews', icon: '↗' },
  { label: 'Snapshots', icon: '◇' },
  { label: 'Settings', icon: '⚙' },
]

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Workspace navigation">
        <div className={styles.brand}>
          <span className={styles.brandMark}>☁</span>
          <span>runforge</span>
        </div>
        <div className={styles.context}>
          <span>WORKSPACE</span>
          <strong>PROJECT: web-platform</strong>
        </div>
        <nav className={styles.navigation}>
          <a className={styles.activeLink} href="#runs" aria-current="page">
            <span>⌁</span> Runs
          </a>
          {navigation.map((item) => (
            <span className={styles.disabledLink} key={item.label} aria-disabled="true">
              <span className={styles.navigationIcon} aria-hidden="true">{item.icon}</span> {item.label}
            </span>
          ))}
        </nav>
        <p className={styles.sidebarFooter}>CONTROL PLANE<br />LOCAL WORKSPACE</p>
      </aside>
      <header className={styles.mobileHeader}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>☁</span>
          <span>runforge</span>
        </div>
        <span className={styles.mobileProject}>web-platform</span>
      </header>
      <main className={styles.content} id="runs">
        <div className={styles.breadcrumb}>web-platform <span>/</span> <strong>Runs</strong></div>
        {children}
      </main>
    </div>
  )
}
