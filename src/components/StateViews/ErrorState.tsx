import styles from './StateViews.module.css'

interface ErrorStateProps { message: string; onRetry: () => void }

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return <section className={styles.state}><span className={styles.stateIcon}>!</span><h2>Could not load runs</h2><p>{message}</p><button type="button" onClick={onRetry}>Retry</button></section>
}
