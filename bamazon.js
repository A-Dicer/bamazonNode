var manager = require("./bamazonManager.js");
var customer = require("./bamazonCustomer.js");
var inquirer = require("inquirer");


//------------------------------ start --------------------------------------
//             inquirer function for selecting what to do

function start(){
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        choices: ["Use BAMAZON Manager", "Use BAMAZON Customer", "Quit"],
        message: "What would you like to do?"
      },
    ]).then(function(res) {
       if(res.action === "Use BAMAZON Manager") manager.viewProducts();
       else if (res.action === "Use BAMAZON Customer") customer.viewProducts();
       else console.log("Bye"); 
    });   
}

start();
