const db = require('../db/connection');
const cTable = require('console.table');

class Company
{
  getDepartments(){
    db.promise().query("SELECT * FROM department;")
    .then( ([err,rows]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then( () => db.end());
  };
}

module.exports=Company;