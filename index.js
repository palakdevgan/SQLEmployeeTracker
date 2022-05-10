const inquirer = require('inquirer');
const CompanyDb = require('./lib/CompanyDb');
const db = new CompanyDb();

const showMenu = () => {
    return inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
    })

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
    db.returnDepartments().then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, DeptName }) => ({
            name: DeptName,
            value: id
        }))
    //console.log(departmentChoices);
    return    inquirer.prompt([
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
                message: 'What would you like to do?',
                name: 'action',
                choices: departmentChoices
            }
        ]).then((answers) => {
            console.log(answers.roleTitle,answers.roleSalary,answers.action);
            db.addRole(answers.roleTitle,Number(answers.roleSalary),Number(answers.action));
        });
    })
    };

    showMenu().then(({ action }) => {
        if (action === 'View all Departments') {
            db.getDepartments();
            showMenu();
        }
        else if (action === 'View all Roles') {
            db.getRoles();
            //showMenu();
        }
        else if (action === 'View all Employees') {
            db.getEmployees();
            //showMenu();
        }
        else if (action === 'Add a Department') {
            addDepartment().then(answers => {
                db.addDepartment(answers.deptName);
            })
            //showMenu();
        }
        else if (action === 'Add a Role') {
            addRole();
            //showMenu();
        }
    });
