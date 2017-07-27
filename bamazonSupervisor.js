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

let config, output, data;

module.exports = { start };

//------------------------- start ----------------------
//        inquirer function for starting the app

function start(){
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        choices: ["View Product Sales By Department", 
        			"Create New Department"],
        message: "What would you like to do?"
      },
    ]).then(function(res) {
       if(res.action === "View Product Sales By Department") viewSales();
       else if (res.action === "Create New Department") addDepartment(); 
    });   
}

//---------------------- newSales ---------------------------
//           shows sales table by Department 

function viewSales(){
  	data = [[
	  	'department_id', 
	  	'department_name', 
	  	'over_head_cost', 
	  	'product_sales', 
	  	'total_profit'
  	],];

	//configures the way the table looks
	config = { border: getBorderCharacters(`norc`) };

	var query = "SELECT departments.department_id, departments.department_name, ";
	query += "departments.over_head_cost, SUM(products.product_sales) AS product_sales ";
	query += "FROM departments  LEFT JOIN products ";
	query += "ON (departments.department_name = products.department_name) ";
	query += "GROUP BY departments.department_id ORDER BY departments.department_name" 
	
	connection.query( query, function(err, result) {
        if (err) throw err;

        for(var i = 0; i < result.length; i++){
	       	var totalProfit = result[i].over_head_cost - result[i].product_sales;
        	data.push(
	            [
	              result[i].department_id.toString(), 
	              result[i].department_name,
	              result[i].over_head_cost + "$", 
	              result[i].product_sales + "$", 
	              parseFloat(totalProfit.toFixed(2)) + "$"
	            ]
	        )
        }
        //makes output for table
	      output = table(data,config);
	      console.log(output);
	      restart(); 
    }) 
}	

//------------------------------ addDepartment --------------------------------------
//                  inquirer function for adding an item

function addDepartment(){
  console.log("What department would you like to add?");
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Department: ",
      },
      {
        name: "overHead",
        type: "input",
        message: "Over Head Cost: ",
      },
    ]).then(function(res) {
        connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: res.department,
          over_head_cost: res.overHead,
        },
        function(err) {
          if (err) throw err;
          console.log("Your department was created successfully!");
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
      if(res.restart) start();
      else {
        console.log("\n\nThanks for using BAMAZON Manager!\n\n"); 
        connection.end();
      }
  });
}

          