INSERT INTO department(name)
VALUES
('Finance'),
('Legal'),
('IT'),
('Backoffice'),
('Marketing');

INSERT INTO role(title,salary,department_id)
VALUES
('Accountant',50000,1),
('Deputy CFO',80000,1),
('CFO',100000,1),
('Lawyer',50000,2),
('Assistant Lawyer',35000,2),
('Junior Developer',50000,3),
('Senior Developer',80000,3),
('Team Lead',120000,3),
('Relationship Manager',70000,4),
('Administrative Assistant',35000,4),
('Backoffice Manager',70000,4),
('Marketing Manager',70000,5);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES
('John','Doe',3,null),
('Tammy','Medina',1,1),
('Palak','Devgan',2,1),
('Amay','Kapoor',4,null),
('Sara','Small',5,4),
('Akshay','Khanna',8,null),
('James', 'Fraser',6,6),
('Jack', 'London',7,6),
('Robert', 'Bruce',7,6),
('Peter', 'Greenaway',11,null),
('Derek', 'Jarman',9,10),
('Paolo', 'Pasolini', 10,10),
('Heathcote', 'Williams',12,null),
('Sandy', 'Powell', 10,10);