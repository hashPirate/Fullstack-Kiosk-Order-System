//Since the menu board is dynamic now, these hardcoded vals will just used to initialized the menu board
export const sidesSection = {
    title: "SIDES",
    subtitle: "+$2.10 for each extra side",
    items: [
        {
            id: "beijing-beef",
            name: "Beijing Beef",
            calories: 470,
            imgLink: "/menu_images/beijing-beef.jpg",
            imageAlt: "Plate of Beijing Beef",
          },
          {
            id: "broccoli-beef",
            name: "Broccoli Beef",
            calories: 150,
            imgLink: "/menu_images/broccoli-beef.jpg",
            imageAlt: "Plate of Broccoli Beef",
          },
          {
            id: "cream-cheese-rangoon",
            name: "Cream Cheese Rangoon",
            calories: 190,
            imgLink: "/menu_images/cream-cheese-rangoon.jpg",
            imageAlt: "Plate of Cream Cheese Rangoon",
          },
          {
            id: "egg-roll",
            name: "Egg Roll",
            calories: 190,
            imgLink: "/menu_images/egg-roll.jpg",
            imageAlt: "Egg Roll",
          },
          {
            id: "grilled-teriyaki-chicken",
            name: "Grilled Teriyaki Chicken",
            calories: 280,
            imgLink: "/menu_images/grilled-teriyaki-chicken.jpg",
            imageAlt: "Grilled Teriyaki Chicken",
          },
          {
            id: "honey-walnut-shrimp",
            name: "Honey Walnut Shrimp",
            calories: 400,
            imgLink: "/menu_images/honey-walnut-shrimp.jpg",
            imageAlt: "Honey Walnut Shrimp",
          },
          {
            id: "kung-pao-chicken",
            name: "Kung Pao Chicken",
            calories: 290,
            imgLink: "/menu_images/kung-pao-chicken.jpg",
            imageAlt: "Kung Pao Chicken",
          },
          {
            id: "mushroom-chicken",
            name: "Mushroom Chicken",
            calories: 450,
            imgLink: "/menu_images/mushroom-chicken.jpg",
            imageAlt: "Mushroom Chicken",
          },
          {
            id: "orange-chicken",
            name: "Orange Chicken",
            calories: 490,
            imgLink: "/menu_images/orange-chicken.jpg",
            imageAlt: "Plate of Orange Chicken",
          },
          {
            id: "sweetfire-chicken-breast",
            name: "Sweetfire Chicken Breast",
            calories: 380,
            imgLink: "/menu_images/sweetfire-chicken-breast.jpg",
            imageAlt: "Plate of Sweetfire Chicken Breast",
          },
    ],
  };
  
  export const baseSection = {
    title: "BASE",
    items: [
      {
        id: "chow-mein",
        name: "Chow Mein",
        calories: 510,
        imgLink: "/menu_images/chow-mein.jpg",
        imageAlt: "Chow mein noodles",
      },
      {
        id: "fried-rice",
        name: "Fried Rice",
        calories: 520,
        imgLink: "/menu_images/rice.jpg", 
        imageAlt: "Fried rice",
      },
    ],
  };
  export const drinkImages = [
    {id: 1, src: "/menu_images/coca-cola.jpg", alt: "CocaCola Can" },
    {id: 2, src: "/menu_images/dr-pepper.jpg", alt: "Dr. Pepper Can" },
    {id: 3, src: "/menu_images/drink.png", alt: "Panda Express Drink" },
    {id: 4, src: "/menu_images/fanta-orange.jpg", alt: "Fanta Orange Can" },
    {id: 5, src: "/menu_images/iced-tea.jpg", alt: "Iced Tea" },
    {id: 6, src: "/menu_images/fanta-strawberry.jpg", alt: "Fanta Strawberry Can" },
    {id: 7, src: "/menu_images/mountain-dew.jpg", alt: "Mountain Dew Can" },
];
  export const drinksSection = {
    title: "DRINKS",
    items: [
      {
        id: "bottled",
        name: "Bottled Drinks",
        calorieR: "0–320 cals",
        price: 2.20,
        imgLink: "/menu_images/drink.png", 
        imageAlt: "Bottled drink",
      },
      {
        id: "iced-tea",
        name: "Iced Tea",
        calorieR: "0 cals",
        price: 2.10,
        imgLink: "/menu_images/iced-tea.jpg",
        imageAlt: "Iced tea",
      },
      {
        id: "fountain",
        name: "Fountain",
        calorieR: "0–510 cals",
        price: 1.90,
        imgLink: "/menu_images/drink.png",
        imageAlt: "Fountain drink",
      },
    ],
  };
  
  export const mealsSection = {
    title: "Pick a Meal",
    options: [
      {
        id: "bowl",
        name: "Bowl",
        calorieR: "0–320 cals",
        description: "1 Base & 1 Side",
        price: 6.40,
        icon: "/menu_images/bowl.png",
        iconAlt: "Bowl meal icon",
      },
      {
        id: "plate",
        name: "Plate",
        calorieR: "0–320 cals",
        description: "1 Base & 2 Side",
        price: 7.90,
        icon: "/menu_images/plate.jpg",
        iconAlt: "Plate meal icon",
      },
      {
        id: "bigger-plate",
        name: "Bigger Plate",
        calorieR: "0–320 cals",
        description: "1 Base & 3 Side",
        price: 9.20,
        icon: "/menu_images/bigplate.png",
        iconAlt: "Bigger plate meal icon",
      },
    ],
  };
  
// const FAKE_INGREDIENTS = [
//     { ingredient_id: 1, name: 'Chicken Breast', current_quantity: 150, quantity_unit: 'lbs', alert_threshold: 50 },
//     { ingredient_id: 2, name: 'White Rice', current_quantity: 200, quantity_unit: 'lbs', alert_threshold: 100 },
//     { ingredient_id: 3, name: 'Broccoli', current_quantity: 45, quantity_unit: 'lbs', alert_threshold: 50 },
//     { ingredient_id: 4, name: 'Orange Sauce', current_quantity: 30, quantity_unit: 'oz', alert_threshold: 40 },
//     { ingredient_id: 5, name: 'Teriyaki Sauce', current_quantity: 25, quantity_unit: 'oz', alert_threshold: 40 },
//     { ingredient_id: 6, name: 'Mushrooms', current_quantity: 15, quantity_unit: 'lbs', alert_threshold: 20 },
//     { ingredient_id: 7, name: 'Zucchini', current_quantity: 8, quantity_unit: 'lbs', alert_threshold: 20 },
//     { ingredient_id: 8, name: 'Bell Peppers', current_quantity: 0, quantity_unit: 'lbs', alert_threshold: 20 },
//     { ingredient_id: 9, name: 'Onions', current_quantity: 35, quantity_unit: 'lbs', alert_threshold: 30 },
//     { ingredient_id: 10, name: 'Sesame Seeds', current_quantity: 5, quantity_unit: 'oz', alert_threshold: 10 }
// ];

// {
//     "Plate": "/menu_images/plate.jpg",
//     "unused menu item": "/menu_images/unused-menu-item.jpg",
//     "Bowl": "/menu_images/bowl.jpg",
//     "Drinks": "/menu_images/drinks.jpg",
//     "Big Plate": "/menu_images/big-plate.jpg",
//     "Appetizer": "/menu_images/appetizer.jpg",
//     "New Part Name": "/menu_images/new-part-name.jpg",
//     "Coconut Chicken": "/menu_images/coconut-chicken.jpg",
//     "Kung Pao Chicken": "/menu_images/kung-pao-chicken.jpg",
//     "Sweetfire Chicken Breast": "/menu_images/sweetfire-chicken-breast.jpg",
//     "String Bean Chicken": "/menu_images/string-bean-chicken.jpg",
//     "Honey Walnut Shrimp": "/menu_images/honey-walnut-shrimp.jpg",
//     "Spring Roll": "/menu_images/spring-roll.jpg",
//     "Cream Cheese Rangoon": "/menu_images/cream-cheese-rangoon.jpg",
//     "Sprite": "/menu_images/sprite.jpg",
//     "Dr. Pepper": "/menu_images/dr-pepper.jpg",
//     "Mountain Dew": "/menu_images/mountain-dew.jpg",
//     "Fanta Orange": "/menu_images/fanta-orange.jpg",
//     "Fanta Strawberry": "/menu_images/fanta-strawberry.jpg",
//     "Hi-C": "/menu_images/hi-c.jpg",
//     "Iced Tea": "/menu_images/iced-tea.jpg",
//     "Diet Pepsi": "/menu_images/diet-pepsi.jpg",
//     "Dr. Pibb": "/menu_images/dr-pibb.jpg",
//     "Grilled Teriyaki Chicken": "/menu_images/grilled-teriyaki-chicken.jpg",
//     "Egg Roll": "/menu_images/egg-roll.jpg",
//     "Broccoli Beef": "/menu_images/broccoli-beef.jpg",
//     "Coca Cola": "/menu_images/coca-cola.jpg",
//     "part name uhm": "/menu_images/part-name-uhm.jpg",
//     "Mushroom Chicken": "/menu_images/mushroom-chicken.jpg",
//     "Orange Chicken": "/menu_images/orange-chicken.jpg",
//     "Beijing Beef": "/menu_images/beijing-beef.jpg",
//     "Fake part": "/menu_images/fake-part.jpg"
// }