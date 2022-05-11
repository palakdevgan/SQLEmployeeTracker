const con = require('../db/connection');

class Company
{
  constructor(con){
    this.con=con;
  }

  getDepartments(){
    const sql=`SELECT d.id,d.name as DeptName FROM department d;`;
    return this.con.promise().query(sql);
  };

  getRoles(){
    const sql=`SELECT r.id as RoleID,r.title as JobTitle,d.name as DeptName,r.salary as Salary
    FROM role r
    LEFT JOIN department d
    ON r.department_id=d.id;`;  
    return this.con.promise().query(sql);
    
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
        return this.con.promise().query(sql);
    
  };

  addDepartment(name){
    const sql = `INSERT INTO department(name)
    VALUES (?);`;
    return this.con.promise().query(sql,[name]);
   
  };

  addRole(title,salary,department_id){
    const sql = `INSERT INTO role(title,salary,department_id)
    VALUES (?,?,?);`;
    return this.con.promise().query(sql,[title,salary,department_id]);
    
  };

  addEmployee(first_name,last_name,role_id,manager_id){
    const sql = `INSERT INTO employee(first_name,last_name,role_id,manager_id)
    VALUES (?,?,?,?);`;
    return this.con.promise().query(sql,[first_name,last_name,role_id,manager_id]);
    
  };

  endCon(){
  this.con.end();
  };
}

module.exports= new Company(con);