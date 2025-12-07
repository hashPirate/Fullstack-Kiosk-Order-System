import styles from "./MenuBoardManager.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
const menuItemFields = {item_name: "",calories: "",calorie_range: "",price: "",description: "",};
const menuBoardSections = [{id: "sides", label: "Sides" },{ id: "base", label: "Base" },{ id: "drinks", label: "Drinks" },{ id: "meals", label: "Meals" },];
// function filterItems(item, section){
//     return item.section=== selectedSection;
// }
export default function MenuBoardManager(){
  const [menuBoardIts, setMenuBoardIts] = useState([]);
  const [fields, setFields] = useState(menuItemFields);
  const [editingId, setEditingId] = useState(null);
  const [EditingBox, setEditingBox] = useState(false);
  const [selectedSection, setSelectedSection] = useState("sides");
  useEffect(() => {
  axios.get("/api/menu-board").then((res) => setMenuBoardIts(res.data)).catch((errMsg) => console.error(errMsg));},[]);
  let sectionmenuBoardIts;
  sectionmenuBoardIts = menuBoardIts.filter((item) =>filterItems(item, selectedSection));
  let editingSizeBase = false;
  let editingDrinks = false;
  let editingMeals= false;
    if(selectedSection === "sides" || selectedSection ==="base"){
        editingSizeBase = true;
    }
    else if(selectedSection === "drinks"){
        editingDrinks = true;
    }
    else if(selectedSection === "meals"){
        editingMeals = true;
    }
    function getSectionButtonType(sectionId) {
        let buttonType = styles.sectionBar;
        if (selectedSection === sectionId) {
            buttonType = buttonType + " " + styles.activeSectionBar;
        }
        return buttonType;
      }
    function filterItems(item, section){
        return item.section=== selectedSection;
    }
    function switchToSection(id){
        setSelectedSection(id);
        setEditingBox(false);
        setFields(menuItemFields);
        setEditingId(null);
    }
    function changeMenuItemAttr(newSec) {
        const name = newSec.target.name;
        const val = newSec.target.value;
        setFields((preSec) => ({...preSec,[name]: val,}));
    }
    function editMenuItem(item) {
        setEditingId(item.menu_board_item_id);
        setFields({item_name: item.item_name || "",calories: item.calories ?? "",calorie_range: item.calorie_range ?? "",price: item.price ?? "",description: item.description ?? "",});
        setEditingBox(true);
    }
    function deleteMenuItem(id) {
        axios.delete("/api/menu-board/" +id).then(function () {
            setMenuBoardIts(function (oldItems) {
                return oldItems.filter(function (item) {
                    return item.menu_board_item_id !==id;});
                });
            })
            .catch(function (errr) {
                console.error(errr);
            });
    }
    function saveMenuItem() {
        let calorieVal = null;
        let calorieRangeVal = null;
        let priceVal = null;
        let descVal = null;
        if(editingSizeBase && fields.calories ===""){
            calorieVal = null;
        }
        else{
            calorieVal = Number(fields.calories);
        }
        if ((editingDrinks || editingMeals) && fields.calorie_range === ""){
            calorieRangeVal = null;
        }
        else{
            calorieRangeVal = fields.calorie_range;
        }
        if (fields.price !== ""){
            priceVal = Number(fields.price) ;
        }
        if(editingMeals && fields.description !== ""){
            descVal=fields.description;
        }
        const menuItemData = {
            section: selectedSection,
            item_name: fields.item_name,
            calories: calorieVal,
            calorie_range: calorieRangeVal,
            price: priceVal,
            description: descVal,
        };
        let creatingNewItem;
        if (editingId ===null){
            creatingNewItem = true;
        }
        else{
            creatingNewItem =false;
        }
        if (creatingNewItem) {
            axios.post("/api/menu-board", menuItemData).then(function (usrInput){
                const newItem = usrInput.data;
                setMenuBoardIts(function (existingItems) {return [...existingItems, newItem];});
                setFields(menuItemFields);
                setEditingId(null);
                setEditingBox(false);
            })
            .catch(function (errrr) {
                console.error(errrr);
            });
        }
        else{
            axios.put(`/api/menu-board/${editingId}`, menuItemData).then(function (usrInput) {
                const updatedItem = usrInput.data;
                setMenuBoardIts(function (existingItems) {
                return existingItems.map(function (item) {
                    if(item.menu_board_item_id === editingId){
                    return updatedItem;
                    }
                    return item;
                });
                });
                setFields(menuItemFields);
                setEditingId(null);
                setEditingBox(false);
            })
            .catch(function (err){
                console.error(err);
            });
        }
  }
  return (
    <div className={styles.menuManagerPage}>
      <div className={styles.menuSections}>
        {menuBoardSections.map((secName) => (
          <button key={secName.id} className={getSectionButtonType(secName.id)} onClick={() => switchToSection(secName.id)}>
          {secName.label}
        </button>
        ))}
      </div>
      <div className={styles.quickItemActions}>
        {!EditingBox && (
            <button className={styles.addButtonNew} onClick={() => { setEditingBox(true);}}>
            Add new {menuBoardSections.find((secName) => secName.id === selectedSection)?.label} item</button>
        )}
        </div>
      {EditingBox && (
        <div className={styles.itemDetailsBox}>
          <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>
          <div className={styles.itemBoxInput}>
            <label>Name</label>
            <input name="item_name" value={fields.item_name} onChange={changeMenuItemAttr}/>
          </div>
          {(editingDrinks || editingMeals) && (
            <div className={styles.itemBoxInput}>
              <label>Calorie Range</label>
              <input name="calorie_range" value={fields.calorie_range} onChange={changeMenuItemAttr}/>
            </div>)
            }
          {editingSizeBase && (
            <div className={styles.itemBoxInput}>
              <label>Calories</label>
              <input type="number" name="calories" value={fields.calories} onChange={changeMenuItemAttr}/>
            </div>
          )}
          {(editingSizeBase || editingDrinks || editingMeals) && (
            <div className={styles.itemBoxInput}>
              <label>Price</label>
              <input type="number" step="1" name="price" value={fields.price} onChange={changeMenuItemAttr}/>
            </div>)}
          {editingMeals && (
            <div className={styles.itemBoxInput}>
              <label>Description</label>
              <input name="description" value={fields.description} onChange={changeMenuItemAttr}/></div>)}
            <div className={styles.boxButtonRow}>
            <button type="button" className={styles.addButton} onClick={saveMenuItem}>{editingId ? "Save" : "Add Item"}</button>
            <button type="button" className={styles.cancelButton} onClick={() =>{ setEditingBox(false);}}>Cancel</button>
            </div>
        </div>
      )}
      <div className={styles.currItemBox}>
        {sectionmenuBoardIts.map((item) => (
          <div key={item.menu_board_item_id} className={styles.currItem}>
            <div className={styles.currItemHeader}>
              <h4 className={styles.currItemTitle}>{item.item_name}</h4>
              <div className={styles.currItemActions}>
                <button className={styles.currItemActions} onClick={() => editMenuItem(item)}>Edit</button>
                <button className={styles.currItemActionsDel} onClick={() => deleteMenuItem(item.menu_board_item_id)}>Delete</button>
                </div>
            </div>
            <div className={styles.currItemBody}>
              {editingSizeBase && (
                <div className={styles.currItemField}>
                  <span className={styles.currItemFieldLabel}>Calories</span>
                  <span className={styles.currItemFieldValue}>{item.calories?? ""}</span>
                </div>)}
              {(editingDrinks || editingMeals) && (
                <div className={styles.currItemField}>
                  <span className={styles.currItemFieldLabel}>Calorie Range</span>
                  <span className={styles.currItemFieldValue}>{item.calorie_range ?? ""}</span>
                </div>)}
              {(editingSizeBase || editingDrinks || editingMeals) && (
                <div className={styles.currItemField}>
                  <span className={styles.currItemFieldLabel}>Price</span>
                  <span className={styles.currItemFieldValue}>{item.price != null? `$${Number(item.price).toFixed(2)}`: ""}</span>
                </div>)}
              {editingMeals &&(
                <div className={styles.currItemField}>
                  <span className={styles.currItemFieldLabel}>Description</span>
                  <span className={styles.currItemFieldValue}>{item.description ?? ""}</span>
                </div>
              )}
            </div>
          </div>))}
      </div>
    </div>
  );}
