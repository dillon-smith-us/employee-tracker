DROP DATABASE IF EXISTS employee_trackerdb;

CREATE DATABASE employee_trackerdb;

USE employee_trackerdb;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUE ("Engineering"), ("Sales"), ("Legal"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUE ("Engineering Lead", 120000, 1), ("Sales Lead", 120000, 2), ("Legal Team Lead", 250000, 3), ("Software Engineer", 80000, 1), ("Salesperson", 80000, 2), ("Lawyer", 200000, 3), ("Accountant", 80000, 4);

-- EMPLOYEES SEED
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("John", "Doe", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jane", "Doe", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Walt", "Disney", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("George", "Lucas", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Oprah", "Winfrey", 2, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Bill", "Gates", 3, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Steve", "Jobs", null, 7);


