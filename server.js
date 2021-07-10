const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_trackerdb',
});

// connection ID //

connection.connect(function(err) {
    if (err) throw err
    console.log("WELCOME TO EMPLOYEE TRACKER")
    startPrompt();
});

//  Prompt begins //
function startPrompt() {
    inquirer.prompt([
      { 
        type: "list",
        message: "what would you like to do?",
        name: "choice",
        choices: [
            "View employees:",
            "View employee roles:",
            "View employee departments:",
            "Add employee:",
            "Add role:",
            "Add department:",
            "Update employee:"
        ]
      }
    ]).then(function(val) {
        switch (val.choice) {
            case "View employees:":
                viewEmployees();
            break;

            case "View employee roles:":
                viewRoles();
            break;

            case "View employee departments:":
                viewDepartments();
            break;

            case "Add employee:":
                addEmployee();
            break;

            case "Update employee:":
                updateEmployee();
            break;

            case "Add role:":
                addRole();
            break; 

            case "Add department:":
                addDepartment();
            break;
        }
    })
}

// view employees function
function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

// employees by roles

function viewRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

// employees by department

function viewDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

// select role queries role title for add new employee prompt

let roleArray = [];
function chooseRole() {
    connection.query("SELECT * FROM role",
    function(err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })
        return roleArray;
}

// choose role queries the managers for add new employee prompt

let managersArray = [];


function chooseManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", 
    function(err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
             managersArray.push(res[i].first_name);
        }
    })
        return managersArray;
}

// adding employee

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "First Name: ",

                validate: function(input){
                    if (input === ""){
                        console.log("** FIELD IS REQUIRED **");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
        },
        {
            name: "lastname",
            type: "input",
            message: "Last Name: ",

                validate: function(input){
                    if (input === ""){
                        console.log("** FIELD IS REQUIRED **");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
        },
        {
            name: "role",
            type: "list",
            message: "What is their role:",
            choices: chooseRole()
        },
        {
            name: "manager",
            type: "rawlist",
            message: "Who is their manager:",
            choices: chooseManager()
        }
    ])
      .then((response) => {
        let roleId = chooseRole().indexOf(response.role) + 1
        let managerId = chooseManager().indexOf(response.manager) + 1
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: response.firstname,
            last_name: response.lastname,
            manager_id: managerId,
            role_id: roleId
        },  function(err){
                if(err) throw err
                console.table(response)
                startPrompt()
        })
    })
}

// update employee

function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    function(err, res) {
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "lastName",
                type: "rawlist",
                
                choices: function() {
                    let lastName = [];
                    for (let i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the employee's last name:",
            },
            {
                name: "role",
                type: "rawlist",
                message: "what is the employee's new role:",
                choices: chooseRole()
            },
        ])
          .then((response) => {
            let roleId = chooseRole().indexOf(response.role) + 1
            connection.query("UPDATE employee SET ? WHERE ?",
            {
                last_name: response.lastName
            },
            {
                role_id: roleId
            },
            function(err){
                
                if (err) throw err
                console.table(response)
                startPrompt()
            })
        });
    });
}

// add employee role

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", 
    function(err, res) {
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "Title",
                type: "input",
                message: "What is the title of the role:",

                validate: function(input){
                    if (input === ""){
                        console.log("** FIELD IS REQUIRED **");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                name: "Salary",
                type: "input",
                message: "Salary pay: ",
                
                validate: function(input){
                    if (input === ""){
                        console.log("** FIELD IS REQUIRED **");
                        return false;
                    }
                    else{
                        return true;
                    }
                }

            },

        ])
          .then((res) => {
            connection.query(
                "INSERT INTO role SET ?",
            {
                title: res.Title,
                salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            })

        });
    });
}

// add departments

function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Department Name: " 
        }
    ]).then((res) => {
        const query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
}