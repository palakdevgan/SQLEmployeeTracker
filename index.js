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

const addDepartment = () =>{
  return inquirer.prompt({
    type:'input',
    name:'deptName',
    message:"What is the Department name? (Required)",
    validate:deptNameInput => {
      if ((typeof deptNameInput === 'string') && deptNameInput && isNaN(deptNameInput)) 
              {
                return true;

              } 
              else 
              {
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

const addRole = () =>{
    var myArray = db.getDepartments();
    return inquirer.prompt([
    {
      type:'input',
      name:'roleTitle',
      message:"What is the Role Title? (Required)",
      validate:roleTitleInput => {
        if ((typeof roleTitleInput === 'string') && roleTitleInput && isNaN(roleTitleInput)) 
                {
                  return true;
  
                } 
                else 
                {
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
        type:'input',
        name:'roleSalary',
        message:"What is the Role's Salary? (Required)",
        validate: roleSalaryInput => {
          if (isNaN(roleSalaryInput) || !roleSalaryInput) 
          {
            console.log("\nPlease enter valid Role Salary!");
          } 
          else 
          {
            return true;
          }
        },
        filter: roleSalaryInput => {
          // clear the invalid input
          return !(isNaN(roleSalaryInput) || !roleSalaryInput) ? roleSalaryInput :''
      }
    },
    {
        type:'list',
        message: 'What would you like to do?',
        name:'action',
        choices:myArray
    }
])
  };

showMenu().then(({action}) =>{
    if(action === 'View all Departments'){
    console.log(db.getDepartments());
    }
    else if(action === 'View all Roles'){
    return db.getRoles();
    }
    else if(action === 'View all Employees'){
    return db.getEmployees();
    }
    else if(action === 'Add a Department'){
    addDepartment().then(answers => {
    return db.addDepartment(answers.deptName);
    })
    }
    else if(action === 'Add a Role'){
        addRole().then(answers => {
       console.log(answers);
        })
        }
});
