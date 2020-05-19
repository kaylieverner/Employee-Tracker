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
        employeeTableData(answer);
        roleTableData(answer);
        start();
    }
    );

    function employeeTableData(answer) {
        connection.query(
            "INSERT INTO employee SET",
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
            },
            function (err) {
                if (err) throw err;
            }
        )
    };

    function roleTableData(answer) {
        connection.query(
            "INSERT INTO role SET",
            {
                title: answer.title,
                salary: answer.salary,
            },
            function (err) {
                if (err) throw err;
            }
        )
    };
}

//remove employee
function rmEmployee() {
    inquirer.prompt({
        name: "remove",
        type: "list",
        message: "Select which employee you would like to remove.",
        choices: ["employee choices go here"],
    }).then(function (answer) {
        connection.query("DELETE FROM employee WHERE name = ?", (answer.remove), function (err, res) {
            if (err) throw err;
            console.log(res);
            start();
        })
    })
};

//update employee role
function updateEmployeeRole() {
    inquirer.prompt(
        {
            name: "employee",
            type: "list",
            message: "Select which employee you would like to update the role for.",
            choices: ["employee choices go here"],
        },
        {
            name: "role",
            type: "list",
            message: "Select a role for the employee.",
            choices: ["role choices go here"],
        }
    ).then(function (answer) {
        connection.query("UPDATE employee SET role = ? WHERE name = ?",
            [
                { role: answer.role },
                { name: answer.employee }
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res);
                start();
            })
    })
};

//update employee manager
function updateEmployeeMgr() {
    inquirer.prompt(
        {
            name: "employee",
            type: "list",
            message: "Select which employee you would like to update the manager for.",
            choices: ["employee choices go here"],
        },
        {
            name: "manager",
            type: "list",
            message: "Select a manager for the employee.",
            choices: ["manager choices go here"],
        }
    ).then(function (answer) {
        connection.query("UPDATE employee SET manager = ? WHERE name = ?",
            [
                { manager: answer.manager },
                { name: answer.employee }
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res);
                start();
            })
    })
};
