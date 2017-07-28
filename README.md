# bamazonNode

	A simple Node testing connections with MySQL database.
There are three challanges but instead of running all three independently just run bamazon.js.


### Bamazon.js

Allows you to run all three .js files from one spot. 
Select either customers, manager, or supervisor.

### Challenge #1: Customer View (Minimum Requirement)

Fairly simple.  Just follow the prompts to buy an item. 
you can buy as many as you want.  If their aren't enough items in the inventory it will inform you as such.  

each time you buy something it will remove that amount from the database and add in the sub total sales price to the database. 

### Challenge #2: Manager View (Next Level)

The manager .js allows you to add items and adjust the quanitity of items.  The instructions wanted you to have an option to view items with a low inventory count.  Instead I have the whole thing pop up on load with low inventory marked in red.  

the first prompt allows you to add inventory to the low items on the database. The second prompt allows you to add a completely new item.

### Challenge #2: Manager View (Next Level)

The manager .js allows you to add items and adjust the quanitity of items.  The instructions wanted you to have an option to view items with a low inventory count.  Instead I have the whole thing pop up on load with low inventory marked in red.  

the first prompt allows you to add inventory to the low items on the database. The second prompt allows you to add a completely new item.

### Challenge #3: Supervisor View (Final Level)

The supervisor .js allows you to add new departments to the database and also will find out how much departments are making.  It does this by checking two different tables, joining them, grouping them, and ordering them by department name. 