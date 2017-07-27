var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
const {table, getBorderCharacters} = require('table');

let config, output, data;

  // connects to MySQL server
  var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root",
    database: "bamazon"
  });

module.exports = { viewProducts };

//---------------- viewProducts ----------------
//                shows products 

function viewProducts(){
  console.log("\nBAMAZON Manager" .bold + "\n---------------------");
  // makes an array for data to put in table
  data = [
      ['ID#', 'Stock', 'Product Name', 'Department', 'Price'], 
  ];
  //configures the way the table looks
  config = { border: getBorderCharacters(`norc`) };

  console.log("\nIventory - red text = low on stock");
  //get the available items 
  connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      
      for(var i = 0; i < res.length; i++){
        if(res[i].stock_quantity < 5){
         	data.push(
            [
              res[i].item_id.toString() .red.bold, 
              res[i].stock_quantity.toString() .red.bold ,
              res[i].product_name .red.bold, 
              res[i].department_name .red.bold, 
              res[i].price.toString() .red.bold + "$" .red.bold
            ]
          )
        }
        else {

          data.push(
            [
              res[i].item_id,
              res[i].stock_quantity, 
              res[i].product_name, 
              res[i].department_name, 
              res[i].price + "$"
            ]
          )
        }
      }
      //makes output for table
      output = table(data,config);
      console.log(output); 
      selection(); 
  });
}
//------------------------------ selection --------------------------------------
//               inquirer function for selecting what to do

function selection(){
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        choices: ["Add to Inventory", "Add New Product"],
        message: "What would you like to do?"
      },
    ]).then(function(res) {
       if(res.action === "Add to Inventory") addInventory();
       else if (res.action === "Add New Product") addItem(); 
    });   
}

//------------------------------ addInventory --------------------------------------
//                 inquirer function for adding to inventory

function addInventory(){
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Product ID #: ",
      },
      {
        name: "amount",
        type: "input",
        message: "Amount: "
      },
    ]).then(function(res) {
      var newAmount;
      connection.query(
      "SELECT stock_quantity FROM products WHERE item_id =" + res.id,

        function(err, result) {
          if (err) throw err;
          
          newAmount = result[0].stock_quantity + parseInt(res.amount);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newAmount
              },
              {
                item_id: res.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Added to stock successfully!");
              restart();
            }
          );
        }
      ); 
    });   
}

//------------------------------ addItem --------------------------------------
//                  inquirer function for adding an item

function addItem(){
  console.log("What product would you like to add?");
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Product Name: ",
      },
       {
        name: "department",
        type: "input",
        message: "Department: ",
      },
       {
        name: "price",
        type: "input",
        message: "Pice: ",
      },
       {
        name: "quantity",
        type: "input",
        message: "Quantity: ",
      },
    ]).then(function(res) {
        connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: res.name,
          Department_name: res.department,
          price: res.price,
          stock_quantity: res.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("Your Product was created successfully!");
          restart();
        }
      );
    });   
}

//------------------------------ restart --------------------------------------
//              inquirer function for restarting or quiting

function restart(){
  inquirer
    .prompt([
      {
        name: "restart",
        type: "confirm",
        message: "Would you like continue using BAMAZON Manager?",
      },
    ]).then(function(res) {
      if(res.restart) viewProducts();
      else {
        console.log("\n\nThanks for using BAMAZON Manager!\n\n"); 
        connection.end();
      }
  });
}