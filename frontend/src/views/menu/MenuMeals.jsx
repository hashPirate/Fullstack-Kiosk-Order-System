import styles from "./MenuBoard.module.css";
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
