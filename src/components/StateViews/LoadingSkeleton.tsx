import styles from './StateViews.module.css'

export function LoadingSkeleton() {
  return <section className={styles.skeletonList} aria-label="Loading runs" aria-busy="true">{[1, 2, 3, 4].map((item) => <div className={styles.skeleton} key={item}><span /><span /><span /></div>)}</section>
}
