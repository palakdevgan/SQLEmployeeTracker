const inquirer =require('inquirer');
const CompanyDb = require('./lib/CompanyDb');


const showMenu = () =>{
    return inquirer.prompt({
        type:'list',
        message: 'What would you like to do?',
        name:'action',
        choices:['View all Departments','View all Roles','View all Employees','Add a Department','Add a Role','Add an Employee','Update an Employee Role']
    })

};

showMenu().then(answers =>{
    return CompanyDb.getDepartments();
})
