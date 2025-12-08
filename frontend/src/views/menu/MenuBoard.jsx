/**
 * @module views/menu
 */
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import styles from "./MenuBoard.module.css";
import MenuParts from "./MenuBoardParts.jsx";
import MenuItem from "./MenuItems.jsx";
import MenuMeals from "./MenuMeals.jsx";
import { IoMdArrowBack } from "react-icons/io";
import axios from "axios";
import {drinkImages,sidesSection,baseSection,mealsSection,} from "./MenuData.js";
const menuSideImg = Object.fromEntries(sidesSection.items.map((s) => [s.name, { imgLink: s.imgLink, imageAlt: s.imageAlt },]));
const menuBaseImg = Object.fromEntries(baseSection.items.map((b) => [b.name,{ imgLink: b.imgLink, imageAlt: b.imageAlt },]));
const menuMealImg = Object.fromEntries(mealsSection.options.map((m) =>[m.name,{ icon: m.icon, iconAlt: m.iconAlt },]));
/**
 * Main Menu Board view component that displays all dynamic menu sections:
 * sides, base, drinks, and meals. Fetches menu board items from the backend
 * and groups them into categories to render the menu board layout.
 *
 * @function MenuBoardView
 * @returns {React.ReactElement} The rendered menu board view.
 */
export default function MenuBoardView() {
  const [sides, setSides] = useState([]);
  const [base, setBase] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    axios .get("/api/menu-board")
      .then((res) => {
        const items = res.data;
        setSides(items.filter((i) => i.section === "sides"));
        setBase(items.filter((i) => i.section === "base"));
        setDrinks(items.filter((i) => i.section === "drinks"));
        setMeals(items.filter((i) => i.section === "meals"));
      })
      .catch((err) => {console.error(err);});
  }, []);
  return (
    <main className={styles.menuBoardHome}>
      <div className={styles.navLeft}>
        <Link to="/"><IoMdArrowBack className={styles.backToHome}/></Link>
      </div>
      <div className={styles.menuBoardFrame}>
        <h1 className={styles.menuTitle}>MENU BOARD</h1>
          {/* BOARD: The board is divided into a left column containing the SIDES and a right column containing BASE, DRINK, and MEAL sections */}
          <div className={styles.boardLayout}>
            {/* Left Column (sides) */}
            <div className={styles.leftColumn}>
            <MenuParts title="SIDES" subtitle="">
                <div className={styles.sidesGrid}>
                  {sides.map((item) => {const img = menuSideImg[item.item_name]|| {imgLink: "/menu_images/beijing-beef.jpg",imageAlt: item.item_name,};
                  return (<MenuItem key={item.menu_board_item_id} name={item.item_name} calories={item.calories} 
                  imgLink={img.imgLink} imageAlt={img.imageAlt} />)})} 
                </div>
              </MenuParts>
            </div>
            {/* Right column contains: Base, Drinks, Meals */}
            <div className={styles.rightColumn}>
              {/* Base:- */}
              <MenuParts title="BASE">
                <div className={styles.baseGrid}>
                  {base.map((item) => { const img = menuBaseImg[item.item_name] ||{imgLink: "/menu_images/beijing-beef.jpg",imageAlt: item.item_name,};
                  return (<MenuItem key={item.menu_board_item_id} name={item.item_name} calories={item.calories} 
                  imgLink={img.imgLink} imageAlt={img.imageAlt}/>)})}
                </div>
              </MenuParts>
              {/* Drinks:- */}
              <MenuParts
              title="DRINKS" headerRight={
                <div className={styles.drinkIconRow}>
                  {drinkImages.map((icon) =>(<img key={icon.id} src={icon.src} alt={icon.alt} className={styles.drinkIcon}/>))}
                </div>}>
              <div className={styles.drinksList}>
                {drinks.map((drink) => (
                  <div key={drink.menu_board_item_id} className={styles.drinkRow}>
                    <div className={styles.drinkInfo}>
                      <span className={styles.drinkName}>{drink.item_name}</span>
                      <span className={styles.drinkCalories}>{drink.calorie_range}</span>
                    </div>
                    <span className={styles.drinkPrice}>{drink.price==null? "": `$${Number(drink.price).toFixed(2)}` }
                    </span>
                  </div>))}
              </div>
            </MenuParts>
                {/* Meal types */}
                <MenuParts title="Pick a Meal">
                  <div className={styles.mealsColumn}>
                    {meals.map((opt) => {const img = menuMealImg[opt.item_name] || {imgLink: "/menu_images/beijing-beef.jpg",imageAlt: item.item_name,};
                    return (<MenuMeals key={opt.menu_board_item_id} name={opt.item_name} calorieR={opt.calorie_range} 
                    description={opt.description} price={opt.price==null? 0: Number(opt.price)} icon={img.icon} iconAlt={img.iconAlt} />)})}
                  </div>
                </MenuParts>
            </div>
          </div>
      </div>
    </main>
  );
}
