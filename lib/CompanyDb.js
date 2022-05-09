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
    const sql=`SELECT * FROM(
        SELECT distinct e.id as EmpID,e.first_name as FirstName,e.last_name as LastName,
        r.title as JobTitle,d.name as DeptName,r.salary as Salary,CONCAT(emp.first_name,' ',emp.last_name) as ManagerName
        FROM employee e
        LEFT JOIN role r ON e.role_id=r.id
        LEFT JOIN department d ON r.department_id=d.id
        LEFT JOIN Employee AS emp ON e.manager_id=emp.id
        where e.manager_id is not null
        union
        SELECT distinct e.id as EmpID,e.first_name as FirstName,e.last_name as LastName,
        r.title as JobTitle,d.name as DeptName,r.salary as Salary,null as ManagerName
        FROM employee e
        LEFT JOIN role r ON e.role_id=r.id
        LEFT JOIN department d ON r.department_id=d.id
        where e.manager_id is null) a
        order by EmpID;`;  
    db.promise().query(sql)
    .then( ([rows,fields]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then( () => db.end());
  };

  addDepartment(name){
    const sql = `INSERT INTO department(name)
    VALUES ('${name}');`;
    db.promise().query(sql)
    .then( ([rows,fields]) => {
      //console.table(rows);
      console.log(`\nAdded ${name} to the database`);
    })
    .catch(console.log)
    .then( () => db.end());
  };
}

module.exports=Company;