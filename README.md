# Welcome to my Bamazon Store!

## bamazonCustomer.js
 When you run my app, you will be greeted to my store and ask if you would like to make a purchase.
![Welcome](./read-me/welcome)

if you choose not to place an order, you will receive the message "Thanks for visiting my store" and you will exit node.
![No Shopping](./read-me/noShopping)

### Placing an Order
When you choose yes, you would like to place an order, you are prompted to enter the item number and quantity desired.  

It does check to make sure the item number is valid.  If it is not, you will be informed "Invalid item number and prompted again to enter the item number.
![Wrong item number](./read-me/wrongItem)

The quanity desired is checked against the quanity in stock and if there aren't enough items to fill your order, you recieve a message to choose a different quantity and lets you know how many are in stock.
![Stock too low](./read-me/notEnough)

If the item number is correct and there is enough in stock, it will ask you if you would like to add another item.  At the same time, the item is pushed to customerOrder array and the quantity is deducted from the mySQL database.
![order another?](./read-me/anotherItem)

At this point, you can order more items (I did for demonstration purposes).  Once you have ordered all of your items, you are given a receipt for your purchase. Then you are exited out of node.
![Receipt](./read-me/receipt)

## bamazonManager.js
When you run bamazonManager.js, you are given the Manager View with four options: 
![Options](./read-me/manager)

#### View Products for Sale
This view shows all items for sale with quantity of inventory. It pulls all data from the mySQL database and displays them. Then prompts you if you would like to do something else.
![Inventory](./read-me/inventory)

#### Low Inventory
This view shows all items with a quantity below 10 items. It searches the database for these items and displays them.
![lowInventory](./read-me/lowInventory)

#### Add to Inventory
Here you can change the quantity of your inventory item.  You are prompted to enter the item number.  It then displays the information for that item.  Then you are prompted to update the inventory quantity.  Here, mySql is updated with the information. You are then given a confirmation statement that the item has been updated.
![updated](./read-me/update)

#### Add New Product
For this view, you can add a new product.  You are prompted to add the item id, name, department, price, and quantity.  This information is pushed to the mySQL products table. You then receive a message the item has been added to your inventory.
![New Item](./read-me/newItem)

By running view Products for Sale again, you can see the slippers are now part of the inventory.
![added](./read-me/added)

Finally, when you are finished, you get a good-bye message and are exited out of node.
![goodbye](./read-me/goodbye)