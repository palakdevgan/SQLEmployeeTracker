const inquirer =require('inquirer');
const CompanyDb = require('./lib/CompanyDb');
const db=new CompanyDb();

const showMenu = () =>{
    return inquirer.prompt({
        type:'list',
        message: 'What would you like to do?',
        name:'action',
        choices:['View all Departments','View all Roles','View all Employees','Add a Department','Add a Role','Add an Employee','Update an Employee Role']
    })

};

showMenu().then(({action}) =>{
    if(action === 'View all Departments'){
    return db.getDepartments();
    }
    else if(action === 'View all Roles'){
        return db.getRoles();
        }
        else if(action === 'View all Employees'){
            return db.getEmployees();
            }
});
