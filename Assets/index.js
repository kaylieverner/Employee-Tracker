var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootpass",
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;
    //run the start function after the connection is made to prompt the user
    start();
});

//show list of available options 
function start() {
    inquirer
        .prompt({
            name: "option",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "None"]
        })
        .then(function (answer) {
            //based on answer, call specific function 
            if (answer.option === "View All Employees") {
                viewAll();
            }
            if (answer.option === "View All Employees by Department") {
                viewAllbyDept();
            }
            if (answer.option === "View All Employees by Manager") {
                viewAllbyMgr();
            }
            if (answer.option === "Add Employee") {
                addEmployee();
            }
            if (answer.option === "Remove Employee") {
                rmEmployee();
            }
            if (answer.option === "Update Employee Role") {
                updateEmployeeRole();
            }
            if (answer.option === "Update Employee Manager") {
                updateEmployeeMgr();
            }
            if (answer.option === "None") {
                connection.end();
            }
        })
};

//FUNCTIONS FOR QUERIES 

//view all employees 
function viewAll() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        start();
    })
};

//view all employees by dept
function viewAllbyDept() {
    inquirer.prompt({
        name: "department",
        type: "list",
        message: "Select which department you would like to view Employees from.",
        choices: ["department choices go here"],
    }).then(function (answer) {
        connection.query("SELECT * FROM department WHERE name = ?", (answer.department), function (err, res) {
            if (err) throw err;
            console.log(res);
            start();
        })
    })
};

//view all employees by manager 
function viewAllbyMgr() {
    inquirer.prompt({
        name: "manager",
        type: "list",
        message: "Select which manager you would like to view Employees for.",
        choices: ["manager choices go here"],
    }).then(function (answer) {
        connection.query("SELECT * FROM department WHERE name = ?", (answer.manager), function (err, res) {
            if (err) throw err;
            console.log(res);
            start();
        })
    })
};

//add employee
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name."
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name."
        },
        {
            name: "manager",
            type: "list",
            message: "Select the employee's manager.",
            choices: ["manager choices go here"]
        }, 
        {
            name: "title",
            type: "list",
            message: "Select the employee's title.",
            choices: ["title choices go here"]
        }, 
        {
            name: "salary",
            type: "input",
            message: "Enter the employee's salary."
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO employee SET", 
            (answer.manager), 
            function (err, res) {
            if (err) throw err;
            console.log(res);
            start();
        })
    })
};

//remove employee

//update employee role

//update employee manager
