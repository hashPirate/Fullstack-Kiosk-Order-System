import styles from "./MenuBoard.module.css";
/**
 * Reusable section wrapper for the menu board (e.g., SIDES, BASE, DRINKS).
 * Renders a header with title, optional subtitle, optional right-side content,
 * and the section body content passed as children.
 * @function MenuBoardParts
 * @param {Object} props
 * @param {string} props.title  The section title.
 * @param {string} [props.subtitle] Optional subtitle text under the title.
 * @param {React.ReactNode} props.children  The main content of the section.
 * @param {React.ReactNode} [props.headerRight]  Optional content on the right side of the header.
 * @returns {React.ReactElement} The rendered menu section container.
 */
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
