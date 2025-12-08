import styles from "./MenuBoard.module.css";
/**
 * Component for displaying a meal option on the menu board
 *
 * @function MenuMeals
 * @param {Object} props
 * @param {string} props.name The meal name.
 * @param {string} props.calorieR The calorie range string for the meal.
 * @param {string} props.description Description of what the meal includes.
 * @param {number} props.price The price of the meal.
 * @param {string} props.icon Image source URL for the meal icon.
 * @param {string} props.iconAlt Alt text for the meal icon image.
 * @returns {React.ReactElement} The rendered meal row.
 */
export default function MenuMeals({ name, calorieR, description, price, icon, iconAlt}){
  return(
    <div className={styles.mealRow}>
      <img src={icon} alt={iconAlt} className={styles.mealIconImg}/>
      <div className={styles.mealInline}>
        <div className={styles.leftStack}>
          <span className={styles.mealName}>{name}</span>
          <span className={styles.mealCalories}>{calorieR}</span>
        </div>
        <div className={styles.rightStack}>
          <span className={styles.mealPrice}>${price.toFixed(2)}</span>
          <span className={styles.mealDescription}>{description}</span>
        </div>
      </div>
    </div>
  );
}
