import { StatusBadge } from '../StatusBadge/StatusBadge'
import { formatDate, formatDuration } from '../../utils/formatters'
import type { Run } from '../../types/run'
import styles from './RunsList.module.css'
import itemStyles from './RunItem.module.css'

interface RunsListProps {
  runs: Run[]
  onSelect: (run: Run) => void
}

export function RunsList({ runs, onSelect }: RunsListProps) {
  return (
    <section className={styles.section} aria-label="AI agent runs">
      <div className={styles.listHeader}><span>{runs.length} RUNS</span><span>UPDATED JUST NOW</span></div>
      <div className={styles.list}>
        {runs.map((run) => (
          <article
            className={itemStyles.item}
            key={run.id}
            tabIndex={0}
            role="button"
            onClick={() => onSelect(run)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect(run)
              }
            }}
            aria-label={`Open ${run.name}`}
          >
            <div className={itemStyles.primary}><h2>{run.name}</h2><StatusBadge status={run.status} /></div>
            <div className={itemStyles.repository}><strong>{run.repository}</strong><span>/</span><code>{run.branch}</code></div>
            <div className={itemStyles.meta}><span>{formatDate(run.createdAt)}</span><span className={itemStyles.duration}>{formatDuration(run.durationSeconds)}</span><span className={itemStyles.arrow}>→</span></div>
          </article>
        ))}
      </div>
    </section>
  )
}
