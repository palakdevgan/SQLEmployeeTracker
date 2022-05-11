const inquirer = require('inquirer');
const db = require('./lib/CompanyDb');
require('console.table');

const showMenu = () => {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Update an Employee Manager', 'View employees by manager', 'View employees by department', 'Delete a Department', 'Delete a Role', 'Delete an Employee', 'View the total utilized budget by department', 'Exit'],
        pageSize: 15
    })
        .then(({ action }) => {
            console.log(action);
            if (action === 'View all Departments') {
                db.getDepartments().then(([rows, fields]) => {
                    console.table(rows);
                    showMenu();
                })
                    .catch((err) => {
                        console.log(err);
                    });

            }
            else if (action === 'View all Roles') {
                db.getRoles().then(([rows, fields]) => {
                    console.table(rows);
                    showMenu();
                })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else if (action === 'View all Employees') {
                db.getEmployees().then(([rows, fields]) => {
                    console.table(rows);
                    showMenu();
                })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else if (action === 'Add a Department') {
                addDepartment().then(answers => {
                    db.addDepartment(answers.deptName).then(([rows, fields]) => {
                        console.log(`\nAdded ${answers.deptName} department to the database`);
                        showMenu();
                    })
                        .catch((err) => {
                            console.log(err);
                        });;
                })
            }
            else if (action === 'Add a Role') {
                addRole();
            }
            else if (action === 'Add an Employee') {
                addEmployee();
            }
            else if (action === 'Update an Employee Role') {
                updateEmpRole();
            }
            else if (action === 'Update an Employee Manager') {
                updateEmpManager();
            }
            else if (action === 'View employees by manager') {
                getEmpByMgr();
            }
            else if (action === 'View employees by department') {
                getEmpByDept();
            }
            else if (action === 'View the total utilized budget by department') {
                getBudgetByDept();
            }
            else if (action === 'Delete a Department') {
                deleteDept();
            }
            else if (action === 'Delete a Role') {
                deleteRole();
            }
            else if (action === 'Delete an Employee') {
                deleteEmployee();
            }
            else if (action === 'Exit') {
                db.endCon();
                process.exit(1);
            }
        });

};

const addDepartment = () => {
    return inquirer.prompt({
        type: 'input',
        name: 'deptName',
        message: "What is the Department name? (Required)",
        validate: deptNameInput => {
            if ((typeof deptNameInput === 'string') && deptNameInput && isNaN(deptNameInput)) {
                return true;

            }
            else {
                console.log("\nPlease enter valid Department name!");
                return false;
            }
        },
        filter: deptNameInput => {
            // clear the invalid input
            return ((typeof deptNameInput === 'string') && deptNameInput && isNaN(deptNameInput)) ? deptNameInput : ''
        }
    })
};

const addRole = () => {
    db.getDepartments().then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, DeptName }) => ({
            name: DeptName,
            value: id
        }))
        return inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: "What is the Role Title? (Required)",
                validate: roleTitleInput => {
                    if ((typeof roleTitleInput === 'string') && roleTitleInput && isNaN(roleTitleInput)) {
                        return true;

                    }
                    else {
                        console.log("\nPlease enter valid Role Title!");
                        return false;
                    }
                },
                filter: roleTitleInput => {
                    // clear the invalid input
                    return ((typeof roleTitleInput === 'string') && roleTitleInput && isNaN(roleTitleInput)) ? roleTitleInput : ''
                }
            }
            ,
            {
                type: 'input',
                name: 'roleSalary',
                message: "What is the Role's Salary? (Required)",
                validate: roleSalaryInput => {
                    if (isNaN(roleSalaryInput) || !roleSalaryInput) {
                        console.log("\nPlease enter valid Role Salary!");
                    }
                    else {
                        return true;
                    }
                },
                filter: roleSalaryInput => {
                    // clear the invalid input
                    return !(isNaN(roleSalaryInput) || !roleSalaryInput) ? roleSalaryInput : ''
                }
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'action',
                choices: departmentChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.addRole(answers.roleTitle, Number(answers.roleSalary), Number(answers.action)).then(([rows, fields]) => {
                console.log(`\nAdded ${answers.roleTitle} role to the database`);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        });
    })
};

const addEmployee = () => {
    db.getRoles().then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ RoleID, JobTitle }) => ({
            name: JobTitle,
            value: RoleID
        }))
        db.getEmployees().then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ EmpID, FirstName, LastName }) => ({
                name: (FirstName + ' ' + LastName),
                value: EmpID
            }))
            managerChoices.push({ name: 'None', value: null });

            //console.log(roleChoices);
            //console.log(managerChoices);
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'empFName',
                    message: "What is the employee's First Name? (Required)",
                    validate: empFNameInput => {
                        if ((typeof empFNameInput === 'string') && empFNameInput && isNaN(empFNameInput)) {
                            return true;

                        }
                        else {
                            console.log("\nPlease enter valid employee first name!");
                            return false;
                        }
                    },
                    filter: empFNameInput => {
                        // clear the invalid input
                        return ((typeof empFNameInput === 'string') && empFNameInput && isNaN(empFNameInput)) ? empFNameInput : ''
                    }
                }
                ,
                {
                    type: 'input',
                    name: 'empLName',
                    message: "What is the employee's Last Name? (Required)",
                    validate: empLNameInput => {
                        if ((typeof empLNameInput === 'string') && empLNameInput && isNaN(empLNameInput)) {
                            return true;

                        }
                        else {
                            console.log("\nPlease enter valid employee last name!");
                            return false;
                        }
                    },
                    filter: empLNameInput => {
                        // clear the invalid input
                        return ((typeof empLNameInput === 'string') && empLNameInput && isNaN(empLNameInput)) ? empLNameInput : ''
                    }
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'empRole',
                    choices: roleChoices,
                    pageSize: 15
                },
                {
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'empManager',
                    choices: managerChoices,
                    pageSize: 15
                }
            ]).then((answers) => {
                //console.log(answers);
                db.addEmployee(answers.empFName, answers.empLName, Number(answers.empRole), answers.empManager).then(([rows, fields]) => {
                    console.log(`\nAdded ${answers.empFName} employee to the database`);
                    showMenu();
                })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })
    })
};

const updateEmpRole = () => {
    db.getRoles().then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ RoleID, JobTitle }) => ({
            name: JobTitle,
            value: RoleID
        }))
        db.getEmployees().then(([rows]) => {
            let employees = rows;
            const empChoices = employees.map(({ EmpID, FirstName, LastName }) => ({
                name: (FirstName + ' ' + LastName),
                value: EmpID
            }))
            //console.log(roleChoices);
            //console.log(empChoices);
            return inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's role do you want to update?",
                    name: 'empName',
                    choices: empChoices,
                    pageSize: 15
                },
                {
                    type: 'list',
                    message: "Please select the employee's new role.",
                    name: 'empRole',
                    choices: roleChoices,
                    pageSize: 15
                }
            ]).then((answers) => {
                //console.log(answers);
                db.updateEmpRole(answers.empRole, answers.empName).then(([rows, fields]) => {
                    console.log(`Updated employee's role in the database`);
                    showMenu();
                })
                    .catch((err) => {
                        console.log(err);
                    });
            })
        })
    })
};

const updateEmpManager = () => {
    db.getEmployees().then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ EmpID, FirstName, LastName }) => ({
            name: (FirstName + ' ' + LastName),
            value: EmpID
        }))
        managerChoices.push({ name: 'None', value: null });
        db.getEmployees().then(([rows]) => {
            let employees = rows;
            const empChoices = employees.map(({ EmpID, FirstName, LastName }) => ({
                name: (FirstName + ' ' + LastName),
                value: EmpID
            }))
            //console.log(empChoices);
            //console.log(managerChoices);
            return inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's manager do you want to update?",
                    name: 'empName',
                    choices: empChoices,
                    pageSize: 15
                },
                {
                    type: 'list',
                    message: "Please select the employee's new manager.",
                    name: 'empManager',
                    choices: managerChoices,
                    pageSize: 15
                }
            ]).then((answers) => {
                //console.log(answers);
                db.updateEmpManager(answers.empManager, answers.empName).then(([rows, fields]) => {
                    console.log(`Updated employee's manager in the database`);
                    showMenu();
                })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })
    })
};

const getEmpByMgr = () => {
    db.getManagers().then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ manager_id, ManagerName }) => ({
            name: ManagerName,
            value: manager_id
        }))

        //console.log(managerChoices);
        return inquirer.prompt([
            {
                type: 'list',
                message: "Please select a Manager to view all Employees under that Manager.",
                name: 'empManager',
                choices: managerChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.getEmpByMgr(answers.empManager).then(([rows, fields]) => {
                console.table(rows);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        })
    })
};

const getEmpByDept = () => {
    db.getDepartments().then(([rows]) => {
        let departments = rows;
        const deptChoices = departments.map(({ id, DeptName }) => ({
            name: DeptName,
            value: id
        }))

        //console.log(deptChoices);
        return inquirer.prompt([
            {
                type: 'list',
                message: "Please select a Department to view all Employees under that Dept.",
                name: 'empDept',
                choices: deptChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.getEmpByDept(answers.empDept).then(([rows, fields]) => {
                console.table(rows);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        })
    })
};

const getBudgetByDept = () => {
    db.getDepartments().then(([rows]) => {
        let departments = rows;
        const deptChoices = departments.map(({ id, DeptName }) => ({
            name: DeptName,
            value: id
        }))

        //console.log(deptChoices);
        return inquirer.prompt([
            {
                type: 'list',
                message: "Please select a Department to view the total utilized budget.",
                name: 'deptBudget',
                choices: deptChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.getBudgetByDept(answers.deptBudget).then(([rows, fields]) => {
                console.table(rows);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        })
    })
};

const deleteDept = () => {
    db.getDepartments().then(([rows]) => {
        let departments = rows;
        const deptChoices = departments.map(({ id, DeptName }) => ({
            name: DeptName,
            value: id
        }))

        //console.log(deptChoices);
        return inquirer.prompt([
            {
                type: 'list',
                message: "Please select a Department you want to delete.",
                name: 'deptName',
                choices: deptChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.deleteDept(answers.deptName).then(([rows, fields]) => {
                console.log(`\nDeleted department from the database`);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        })
    })
};

const deleteRole = () => {
    db.getRoles().then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ RoleID, JobTitle }) => ({
            name: JobTitle,
            value: RoleID
        }))
        return inquirer.prompt([
            {
                type: 'list',
                message: "Please select the role you want to delete.",
                name: 'roleName',
                choices: roleChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.deleteRole(answers.roleName).then(([rows, fields]) => {
                console.log(`\nDeleted role from the database`);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        })
    })
};

const deleteEmployee = () => {
    db.getEmployees().then(([rows]) => {
        let employees = rows;
        const empChoices = employees.map(({ EmpID, FirstName, LastName }) => ({
            name: (FirstName + ' ' + LastName),
            value: EmpID
        }))
        return inquirer.prompt([
            {
                type: 'list',
                message: "Please select the employee you want to delete.",
                name: 'empName',
                choices: empChoices,
                pageSize: 15
            }
        ]).then((answers) => {
            db.deleteEmployee(answers.empName).then(([rows, fields]) => {
                console.log(`\nDeleted employee from the database`);
                showMenu();
            })
                .catch((err) => {
                    console.log(err);
                });
        })
    })
};


showMenu();

//exports.showMenu=showMenu;