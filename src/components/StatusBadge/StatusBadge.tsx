import type { RunStatus } from '../../types/run'
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  status: RunStatus
}

const labels: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.indicator} aria-hidden="true">●</span>
      {labels[status]}
    </span>
  )
}
