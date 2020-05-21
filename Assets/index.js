var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');

// console.log(columnify(data, {columns: ["ID", "First Name", "Last Name", "Title", "Department", "Salary", "Manager"]}));

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

//view all employees - UPDATE NEED TO SHOW MANAGER NAMES INSTEAD OF THEIR ID 

function viewAll() {
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id FROM employee RIGHT JOIN role on employee.role_id = role.id INNER JOIN department on role.department_id = department.id ORDER BY employee.id",
        function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].title + " | " + res[i].name + " | " + res[i].salary + " | " + res[i].manager_id
                )
            }
            start();
        })
};

//view all employees by dept
function viewAllbyDept() {
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err; 
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Select which department you would like to view Employees from.",
            choices: function () {
                var deptArray = []; 
                for(var i = 0; i < results.length; i++) {
                    deptArray.push(results[i].name);
                }
                return deptArray; 
            }
    }).then(function (answer) {
        connection.query(
            "SELECT employee.first_name, employee.last_name, department.name FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department on role.department_id = department.id WHERE department.name = ?", 
        (answer.department), 
        function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].first_name + " " + res[i].last_name + " | " + res[i].name
                )
            }
            start();
        })
    })
})};

//view all employees by manager - NEEDS TO BE UPDATED
function viewAllbyMgr() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager ID = ?", function(err, results) {
        if (err) throw err; 
        inquirer.prompt({
            name: "manager",
            type: "list",
            message: "Select which manager you would like to view Employees for.",
            choices: function () {
                var managerArray = []; 
                for(var i = 0; i < results.length; i++) {
                    managerArray.push(results[i].first_name + " " + results[i].last_name);
                }
                return managerArray; 
            }
    }).then(function (answer) {
        connection.query("SELECT * FROM employee WHERE manager_id = ?", (answer.manager), function (err, res) {
            if (err) throw err;
            console.log(res);
            start();
        })
    })
})};

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

//remove employee - UPDATE THEN FUNCTION 
function rmEmployee() {
connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err; 
    inquirer.prompt({
        name: "employee",
        type: "list",
        message: "Select which employee you would like to remove.",
        choices: function () {
            var employeeArray = []; 
            for(var i = 0; i < results.length; i++) {
                employeeArray.push(results[i].first_name + " " + results[i].last_name);
            }
            return employeeArray; 
        }
}).then(function (answer) {
    connection.query(
        "DELETE FROM employee WHERE first_name = ? AND last_name = ?", 
    [answer.first_name, answer.last_name], 
    function (err, res) {
        if (err) throw err;
        start();
    })
})
})};

//update employee role - UPDATE THE THEN STATEMENTS 
function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer.prompt(
            {
                name: "employee",
                type: "list",
                message: "Select which employee you would like to update the role for.",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].first_name + " " + results[i].last_name);
                    }
                    return choiceArray;
                },
            }).then(function (answer) {
                connection.query("SELECT * FROM role", function (err, results) {
                    if (err) throw err;
                    inquirer.prompt(
                        {
                            name: "role",
                            type: "list",
                            message: "Which role would you like to assign to the employee?",
                            choices: function () {
                                var roleArray = [];
                                for (var i = 0; i < results.length; i++) {
                                    roleArray.push(results[i].title);
                                }
                                return roleArray;
                            }
                        }).then(function (answer) {
                            connection.query("UPDATE employee SET role = ? WHERE name = ?",
                                [
                                    { role_id: answer.role },
                                    { name: answer.employee }
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res);
                                    start();
                                })
                        })
                })
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
