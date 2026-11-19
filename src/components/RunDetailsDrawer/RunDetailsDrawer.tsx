import { useEffect } from 'react'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { formatDate, formatDuration } from '../../utils/formatters'
import type { Run } from '../../types/run'
import styles from './RunDetailsDrawer.module.css'

interface RunDetailsDrawerProps {
  run: Run | null
  onClose: () => void
}

export function RunDetailsDrawer({ run, onClose }: RunDetailsDrawerProps) {
  useEffect(() => {
    if (!run) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, run])

  if (!run) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(event) => event.stopPropagation()}>
        <div className={styles.topbar}><button type="button" onClick={onClose}>← Back to runs</button><button type="button" onClick={onClose} aria-label="Close details">×</button></div>
        <div className={styles.header}><p>RUN DETAILS</p><h2 id="drawer-title">{run.name}</h2><StatusBadge status={run.status} /></div>
        <dl className={styles.metadata}>
          <div><dt>ID</dt><dd>{run.id}</dd></div>
          <div><dt>Repository</dt><dd>{run.repository}</dd></div>
          <div><dt>Branch</dt><dd>{run.branch}</dd></div>
          <div><dt>Created</dt><dd>{formatDate(run.createdAt)}</dd></div>
          <div><dt>Duration</dt><dd>{formatDuration(run.durationSeconds)}</dd></div>
        </dl>
        <section className={styles.result}><h3>Result</h3><p>{run.result ?? 'This run has not produced a result yet.'}</p></section>
        <section><h3>Logs</h3><ol className={styles.logs}>{run.logs.map((log, index) => <li key={`${run.id}-${index}`}>{log}</li>)}</ol></section>
      </aside>
    </div>
  )
}
