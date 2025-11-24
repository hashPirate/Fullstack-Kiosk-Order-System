import styles from "./MenuBoard.module.css";
export default function MenuBoardParts({ title, subtitle, children, headerRight, }) {
        return(
          <section className={styles.menuSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <span className={styles.sectionTitle}>{title}</span>
                {subtitle && (<span className={styles.sectionSubtitle}>{subtitle}</span>)}
              </div>
              {headerRight && (<div className={styles.sectionHeaderRight}>{headerRight}</div>)}
            </div>
            <div className={styles.sectionBody}>{children}</div>
          </section>);}
