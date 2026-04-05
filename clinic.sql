-- =========================
-- 🧹 CLEAN START
-- =========================
CREATE DATABASE clinic 
\c clinic

DROP TABLE IF EXISTS test_results, lab_tests, admissions, rooms,
prescription_items, prescriptions, invoices, appointments,
reception, doctors, patients, users CASCADE;

-- =========================
-- 👥 USERS
--1 =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 🏥 PATIENTS
--2 =========================
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    phone VARCHAR(20) UNIQUE     -- في مشاريع قادمة سوف نقوم بها على ENUM
    
);

-- =========================
-- 👨‍⚕️ DOCTORS
--3 =========================
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    phone VARCHAR(20) UNIQUE
);

-- =========================
-- 📅 APPOINTMENTS
--4 =========================
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    CHECK (status IN ('confirmed', 'canceled', 'pending'))
);

-- =========================
-- 📋 PRESCRIPTIONS
--5 =========================
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
    date DATE DEFAULT CURRENT_DATE
);

-- =========================
-- 💊 PRESCRIPTION ITEMS
--6 =========================
CREATE TABLE prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INT REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_name VARCHAR(100),
    dosage VARCHAR(100)
);

-- =========================
-- 💰 INVOICES
--7 =========================
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    total DECIMAL(10,2) DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE
);

-- =========================
-- 🛏️ ROOMS
--8 =========================
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number INT UNIQUE,
   type VARCHAR(50) CHECK (type IN ('normal', 'vip', 'emergency'))
);

-- =========================
-- 🛌 ADMISSIONS
--9 =========================
CREATE TABLE admissions (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    room_id INT REFERENCES rooms(id) ON DELETE SET NULL,
    entry_date DATE,
    exit_date DATE
);

-- =========================
-- 🧪 LAB TESTS
--10 =========================
CREATE TABLE lab_tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL ,
    price DECIMAL(10,2)
);

-- =========================
-- 📊 TEST RESULTS
--11 =========================
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    test_id INT NOT NULL REFERENCES lab_tests(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    result TEXT
);

-- =========================
-- 📞 RECEPTION
--12 =========================
CREATE TABLE reception (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('waiting', 'done', 'canceled'))
);


INSERT INTO users (username, password, email, role) VALUES
('admin1','1234','a1@mail.com','admin'),
('doc1','1234','d1@mail.com','doctor'),
('rec1','1234','r1@mail.com','receptionist'),
('doc2','1234','d2@mail.com','doctor'),
('rec2','1234','r2@mail.com','receptionist'),
('doc3','1234','d3@mail.com','doctor'),
('rec3','1234','r3@mail.com','receptionist'),
('doc4','1234','d4@mail.com','doctor'),
('rec4','1234','r4@mail.com','receptionist'),
('doc5','1234','d5@mail.com','doctor'),
('rec5','1234','r5@mail.com','receptionist'),
('doc6','1234','d6@mail.com','doctor'),
('rec6','1234','r6@mail.com','receptionist'),
('doc7','1234','d7@mail.com','doctor'),
('rec7','1234','r7@mail.com','receptionist'),
('doc8','1234','d8@mail.com','doctor'),
('rec8','1234','r8@mail.com','receptionist'),
('doc9','1234','d9@mail.com','doctor'),
('rec9','1234','r9@mail.com','receptionist'),
('doc10','1234','d10@mail.com','doctor');


INSERT INTO patients (name, age, gender, phone) VALUES
('Ali',25,'male','0550000001'),
('Sara',30,'female','0550000002'),
('Omar',40,'male','0550000003'),
('Lina',22,'female','0550000004'),
('Yacine',35,'male','0550000005'),
('Nour',28,'female','0550000006'),
('Amine',45,'male','0550000007'),
('Aya',19,'female','0550000008'),
('Samir',50,'male','0550000009'),
('Rania',33,'female','0550000010'),
('Khaled',29,'male','0550000011'),
('Meriem',27,'female','0550000012'),
('Hichem',38,'male','0550000013'),
('Imane',24,'female','0550000014'),
('Sofiane',31,'male','0550000015'),
('Nadia',36,'female','0550000016'),
('Karim',41,'male','0550000017'),
('Yasmine',23,'female','0550000018'),
('Adel',48,'male','0550000019'),
('Farah',26,'female','0550000020');


INSERT INTO doctors (name, specialty, phone) VALUES
('Dr A','Cardiology','0660000001'),
('Dr B','Dermatology','0660000002'),
('Dr C','Pediatrics','0660000003'),
('Dr D','Neurology','0660000004'),
('Dr E','Orthopedics','0660000005'),
('Dr F','General','0660000006'),
('Dr G','Dentist','0660000007'),
('Dr H','Cardiology','0660000008'),
('Dr I','Dermatology','0660000009'),
('Dr J','Pediatrics','0660000010'),
('Dr K','Neurology','0660000011'),
('Dr L','Orthopedics','0660000012'),
('Dr M','General','0660000013'),
('Dr N','Dentist','0660000014'),
('Dr O','Cardiology','0660000015'),
('Dr P','Dermatology','0660000016'),
('Dr Q','Pediatrics','0660000017'),
('Dr R','Neurology','0660000018'),
('Dr S','Orthopedics','0660000019'),
('Dr T','General','0660000020');


INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES
(1,1,CURRENT_DATE,'10:00','confirmed'),
(2,2,CURRENT_DATE,'11:00','pending'),
(3,3,CURRENT_DATE,'12:00','confirmed'),
(4,4,CURRENT_DATE,'13:00','canceled'),
(5,5,CURRENT_DATE,'14:00','confirmed'),
(6,6,CURRENT_DATE,'15:00','pending'),
(7,7,CURRENT_DATE,'16:00','confirmed'),
(8,8,CURRENT_DATE,'17:00','confirmed'),
(9,9,CURRENT_DATE,'09:00','pending'),
(10,10,CURRENT_DATE,'10:30','confirmed'),
(11,11,CURRENT_DATE,'11:30','confirmed'),
(12,12,CURRENT_DATE,'12:30','pending'),
(13,13,CURRENT_DATE,'13:30','confirmed'),
(14,14,CURRENT_DATE,'14:30','canceled'),
(15,15,CURRENT_DATE,'15:30','confirmed'),
(16,16,CURRENT_DATE,'16:30','pending'),
(17,17,CURRENT_DATE,'17:30','confirmed'),
(18,18,CURRENT_DATE,'18:00','confirmed'),
(19,19,CURRENT_DATE,'08:30','pending'),
(20,20,CURRENT_DATE,'09:30','confirmed');



INSERT INTO invoices (patient_id, total) VALUES
(1,100),(2,150),(3,200),(4,120),(5,300),
(6,80),(7,90),(8,110),(9,220),(10,140),
(11,160),(12,180),(13,210),(14,170),(15,130),
(16,190),(17,250),(18,260),(19,270),(20,280);



INSERT INTO rooms (number, type) VALUES
(1,'normal'),(2,'vip'),(3,'emergency'),(4,'normal'),(5,'vip'),
(6,'normal'),(7,'emergency'),(8,'vip'),(9,'normal'),(10,'normal'),
(11,'vip'),(12,'normal'),(13,'emergency'),(14,'vip'),(15,'normal'),
(16,'normal'),(17,'vip'),(18,'emergency'),(19,'normal'),(20,'vip');

INSERT INTO admissions (patient_id, room_id, entry_date, exit_date) VALUES
(1,1,CURRENT_DATE,NULL),
(2,2,CURRENT_DATE,NULL),
(3,3,CURRENT_DATE,NULL),
(4,4,CURRENT_DATE,NULL),
(5,5,CURRENT_DATE,NULL),
(6,6,CURRENT_DATE,NULL),
(7,7,CURRENT_DATE,NULL),
(8,8,CURRENT_DATE,NULL),
(9,9,CURRENT_DATE,NULL),
(10,10,CURRENT_DATE,NULL),
(11,11,CURRENT_DATE,NULL),
(12,12,CURRENT_DATE,NULL),
(13,13,CURRENT_DATE,NULL),
(14,14,CURRENT_DATE,NULL),
(15,15,CURRENT_DATE,NULL),
(16,16,CURRENT_DATE,NULL),
(17,17,CURRENT_DATE,NULL),
(18,18,CURRENT_DATE,NULL),
(19,19,CURRENT_DATE,NULL),
(20,20,CURRENT_DATE,NULL);



INSERT INTO lab_tests (name, price) VALUES
('Blood Test',50),('X-Ray',100),('MRI',300),('CT Scan',250),
('Urine Test',40),('ECG',80),('Echo',120),('Glucose',30),
('Cholesterol',60),('Covid',70),('Iron',45),('Vitamin D',55),
('Calcium',65),('Hormone',150),('Allergy',110),('Liver',90),
('Kidney',95),('Thyroid',85),('DNA',400),('Cancer',500);



INSERT INTO test_results (patient_id, test_id, result) VALUES
(1,1,'Normal'),(2,2,'Normal'),(3,3,'High'),(4,4,'Low'),
(5,5,'Normal'),(6,6,'Normal'),(7,7,'High'),(8,8,'Normal'),
(9,9,'Normal'),(10,10,'Positive'),(11,11,'Normal'),(12,12,'Low'),
(13,13,'Normal'),(14,14,'High'),(15,15,'Normal'),(16,16,'Normal'),
(17,17,'Low'),(18,18,'Normal'),(19,19,'High'),(20,20,'Critical');


INSERT INTO reception (patient_id, status) VALUES
(1,'waiting'),(2,'done'),(3,'waiting'),(4,'canceled'),
(5,'done'),(6,'waiting'),(7,'done'),(8,'waiting'),
(9,'done'),(10,'waiting'),(11,'done'),(12,'waiting'),
(13,'done'),(14,'canceled'),(15,'waiting'),(16,'done'),
(17,'waiting'),(18,'done'),(19,'waiting'),(20,'done');

