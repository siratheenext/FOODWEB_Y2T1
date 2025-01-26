[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/OspoeYOK)

-เมื่อได้โฟลเดอร์ไปให้จัดโฟลเดอร์อยู่ในรุปแบบนี้
Project_Sec2_gr8
|_Sec2_gr8_fe_src
	|_html
	|_style
|_Sec2_gr8_ws_src
	|_back
	|_front

โดยต้อง cd เข้าไปที่โฟลเดอร์ Sec2_gr8_ws_src และ front ทำการ npm init ให้ตั้งentry point เป็น front.js
และทำการติดตั้ง npm install ดังนี้
-body-parser
-cookie-parser
-cors
-dotenv
-express
-fs
-multer
-mysql2
-nodemon

และ cd เข้าโฟลเดอร์ Sec2_gr8_ws_src และ back ตามลำดับ ทำการ npm init  ให้ตั้งentry point เป็น back.js
และทำการติดตั้ง npm install ดังนี้
-body-parser
-cookie-parser
-cors
-dotenv
-express
-fs
-multer
-mysql2
-nodemon

เมื่อติดตั้งเสร็จให้เปลี่ยน scripts ใน  package.json ของทั้ง front และ back เป็น "start": "nodemon front.js" และให้ทำการพิมพ์ url: “localhost:3030”

ในส่วนของไฟล์ mysql เมื่อโหลดไฟล์แล้วให้ตั้งค่า user and privileges และ Add account 
ให้ตั้ง username เป็น itds242 
hosts เป็น localhost
password เป็น ict555!!!
และให้ทำการ create database use database create table และ insert ข้อมูลเบื้องต้น
หลังจากนั้น ให้ไปตั้งค่าที่ Schema Privilege และกดปุ่ม Add Enitity เลือก Seleted schema เป็น chicknext
เลือกให้สิทธิ์ในส่วนของ Object Rights ทุกอัน

