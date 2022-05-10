const inquirer = require('inquirer');
const db = require('./lib/CompanyDb');


const showMenu = () => {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role','Exit'],
        pageSize:8
    }).then(({ action }) => {
        if (action === 'View all Departments') {
            db.getDepartments().then( ([rows,fields]) => {
                //console.log('\n');
                console.table(rows);
                showMenu();
                //index.showMenu();
              })
              .catch(console.log);
            
        }
       else if (action === 'View all Roles') {
            db.getRoles().then( ([rows,fields]) => {
                //console.log('\n');
                console.table(rows);
                showMenu();
              })
              .catch((err) => {
                  console.log(err);
              });
            //showMenu();
        }
        else if (action === 'View all Employees') {
            db.getEmployees().then( ([rows,fields]) => {
                //console.log('\n');
                console.table(rows);
                showMenu();
              })
              .catch(console.log);
            //showMenu();
        }
        else if (action === 'Add a Department') {
            addDepartment().then(answers => {
                db.addDepartment(answers.deptName).then( ([rows,fields]) => {
                    //console.table(rows);
                    console.log(`\nAdded ${answers.deptName} to the database`);
                    showMenu();
                  })
                  .catch(console.log);;
            })
            //showMenu();
        }
        else if (action === 'Add a Role') {
            addRole().then((answers) => {
                db.addRole(answers.roleTitle,Number(answers.roleSalary),Number(answers.action)).then( ([rows,fields]) => {
                    //console.table(rows);
                    console.log(`\nAdded ${title},${salary},${department_id} to the database`);
                    showMenu();
                  })
                  .catch(console.log);
            })
            //showMenu();
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
        ])
    })
    };

    showMenu();

//exports.showMenu=showMenu;