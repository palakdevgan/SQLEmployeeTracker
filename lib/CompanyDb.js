const db = require('../db/connection');
const cTable = require('console.table');

class Company
{
  getDepartments(){
    const sql=`SELECT d.id,d.name as DeptName FROM department d;`;
    db.promise().query(sql)
    .then( ([rows,fields]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then( () => db.end());
  };

  getRoles(){
    const sql=`SELECT r.id as RoleID,r.title as JobTitle,d.name as DeptName,r.salary as Salary
    FROM role r
    LEFT JOIN department d
    ON r.department_id=d.id;`;  
    db.promise().query(sql)
    .then( ([rows,fields]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then( () => db.end());
  };

  getEmployees(){
    const sql=`SELECT distinct e.id as EmpID,e.first_name as FirstName,e.last_name as LastName,
    r.title as JobTitle,d.name as DeptName,r.salary as Salary,emp.*
    FROM employee e
    LEFT JOIN role r ON e.role_id=r.id
    LEFT JOIN department d ON r.department_id=d.id
    JOIN employee emp ON e.id=emp.manager_id;`;  
    db.promise().query(sql)
    .then( ([rows,fields]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then( () => db.end());
  };
}

module.exports=Company;