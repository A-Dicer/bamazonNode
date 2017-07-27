var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
const {table, getBorderCharacters} = require('table');

// connects to MySQL server
var connection = mysql.createConnection({
  	host: "localhost",
  	port: 3306,
	user: "root",
  	password: "root",
 	database: "bamazon"
});

module.exports = { viewProducts };

//ok there is a lot going on here.... 
//first is just setting up the npm for table

let config, output, data;

//---------------- viewProducts ----------------
//                shows products 
function viewProducts(){
	// makes an array for data to put in table
	data = [
	    ['ID#' .underline.red, 'Product Name' .underline.red, 'Department' .underline.red, 'Price' .underline.red], 
	];
	//configures the way the table looks
	config = { border: getBorderCharacters(`norc`) };
	console.log("\nWelcome to BAMAZON!\n---------------------");
	console.log("\nItems Available");
	//get the available items 
	connection.query("SELECT * FROM products ORDER BY department_name", function(err, results) {
	    if (err) throw err;
	    
	    for(i = 0; i < results.length; i++){
	     	data.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price + "$"]);
	    }
	    //makes output for table
	    output = table(data,config);
	    console.log(output);
	    buy();
	});
}
//------------------------------ buy --------------------------------------
//               inquirer function for buying a product

function buy(){
	console.log("What would you like to buy?");
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
      	var quantity;
      	var newQuantity;
      	connection.query(
        "SELECT * FROM products WHERE item_id =" + res.id,
	        function(err, results) {
	          	if (err) throw err;
	          	if(results[0].stock_quantity < parseInt(res.amount)){
	          		console.log("\nWe don't have the amount you requested!\n");
	          	} else {
	          		quantity = results[0].stock_quantity
	          		newQuantity = quantity - parseInt(res.amount);
	          		connection.query(
			            "UPDATE products SET ? WHERE ?",
			            [{stock_quantity: newQuantity},{item_id: res.id}],
			            function(error) {
			              if (error) throw error;     
			            }
			        );

			        var subTotal = parseFloat((results[0].price * parseInt(res.amount)).toFixed(2));
			        var tax = (subTotal * .06).toFixed(2);
			        var totalPrice = subTotal + parseFloat(tax);
			        var newTotal = subTotal + results[0].product_sales;
			        connection.query(
			            "UPDATE products SET ? WHERE ?",
			            [{product_sales: newTotal},{item_id: res.id}],
			            function(error) {
			              if (error) throw error;     
			            }
			        );

			        console.log(
			        	"\nRECEIPT\n---------------\n" +
			        	"Item: " + results[0].product_name + "\n" +
			        	"Quantity: " + res.amount  + "\n" +
			        	"Price " + results[0].price + "$\n" +
			        	"---------------\n" +
			        	"Sub Total: " + subTotal.toFixed(2) + "$\n" +
			        	"Tax: " + tax + "$\n" +
			        	"-------------------------\n" +
			        	"Total Price: " + totalPrice.toFixed(2) + "$\n"
			        )         		
				}
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
        message: "Would you like continue purchasing items?",
      },
    ]).then(function(res) {
    	if(res.restart) viewProducts();
    	else {
    		console.log("\n\nThanks for using BAMAZON!\n\n"); 
    		connection.end();
    	}
	});
}
