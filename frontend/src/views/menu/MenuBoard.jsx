import styles from "./MenuBoard.module.css";
import MenuParts from "./MenuBoardParts.jsx";
import MenuItem from "./MenuItems.jsx";
import MenuMeals from "./MenuMeals.jsx";
import {sidesSection, baseSection, drinksSection, mealsSection, drinkImages,} from "./MenuData.js";
export default function MenuBoardView() {
  return (
    <main className={styles.menuBoardHome}>
      <div className={styles.menuBoardFrame}>
        <h1 className={styles.menuTitle}>MENU BOARD</h1>
          {/* BOARD: The board is divided into a left column containing the SIDES and a right column containing BASE, DRINK, and MEAL sections */}
          <div className={styles.boardLayout}>
            {/* Left Column (sides) */}
            <div className={styles.leftColumn}>
              <MenuParts title={sidesSection.title} subtitle={sidesSection.subtitle}>
                <div className={styles.sidesGrid}>
                  {sidesSection.items.map((item) => (<MenuItem key={item.id} {...item} />))}
                </div>
              </MenuParts>
            </div>
            {/* Right column contains: Base, Drinks, Meals */}
            <div className={styles.rightColumn}>
              {/* Base:- */}
              <MenuParts title={baseSection.title}>
                <div className={styles.baseGrid}>
                  {baseSection.items.map((item) => (<MenuItem key={item.id} {...item}/>))}
                </div>
              </MenuParts>
              {/* Drinks:- */}
              <MenuParts
              title={drinksSection.title} headerRight={
                <div className={styles.drinkIconRow}>
                  {drinkImages.map((icon) =>(<img key={icon.id} src={icon.src} alt={icon.alt} className={styles.drinkIcon}/>))}
                </div>}>
              <div className={styles.drinksList}>
                {drinksSection.items.map((drink) => (
                  <div key={drink.id} className={styles.drinkRow}>
                    <div className={styles.drinkInfo}>
                      <span className={styles.drinkName}>{drink.name}</span>
                      <span className={styles.drinkCalories}>{drink.calorieR}</span>
                    </div>
                    <span className={styles.drinkPrice}>${drink.price.toFixed(2)}</span>
                  </div>))}
              </div>
            </MenuParts>
                {/* Meal types */}
                <MenuParts title={mealsSection.title}>
                  <div className={styles.mealsColumn}>
                    {mealsSection.options.map((opt) => (<MenuMeals key={opt.id} {...opt} />))}
                  </div>
                </MenuParts>
            </div>
          </div>
      </div>
    </main>
  );
}
