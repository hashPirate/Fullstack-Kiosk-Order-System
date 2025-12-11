import styles from "./MenuBoard.module.css";
/**
 * Card component for displaying a single menu item on the menu board
 *
 * @function MenuItems
 * @param {Object} props
 * @param {string} props.name The name of the menu item.
 * @param {number} [props.calories] The calorie value for the item, if available.
 * @param {string} props.imgLink Image source URL for the item.
 * @param {string} props.imageAlt Alt text describing the item image.
 * @returns {React.ReactElement} The rendered menu item card.
 */
export default function MenuItems({ name, calories, imgLink, imageAlt, price}) {
  return (
    <div className={styles.menuItemCard}>
      <img src={imgLink} alt={imageAlt} className={styles.itemImg} />
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{name}</span>
        {calories != null && (<span className={styles.itemCalories}>{calories} cals</span>)}
        {price != null && (<span className={styles.itemPrice}>${Number(price).toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}