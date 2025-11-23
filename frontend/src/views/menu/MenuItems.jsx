import styles from "./MenuBoard.module.css";
export default function MenuItems({ name, calories, imgLink, imageAlt }) {
  return (
    <div className={styles.menuItemCard}>
      <img src={imgLink} alt={imageAlt} className={styles.itemImg} />
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{name}</span>
        {calories != null && (<span className={styles.itemCalories}>{calories} cals</span>)}
      </div>
    </div>
  );
}