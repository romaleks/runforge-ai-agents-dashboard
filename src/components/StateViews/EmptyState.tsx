import styles from './StateViews.module.css'

interface EmptyStateProps { onReset: () => void }

export function EmptyState({ onReset }: EmptyStateProps) {
  return <section className={styles.state}><span className={styles.stateIcon}>⌕</span><h2>No runs found</h2><p>Try changing your search or status filter.</p><button type="button" onClick={onReset}>Reset filters</button></section>
}
