create database if not exists Chicknext;
use Chicknext;

create table myadmin(
	adminid int not null auto_increment unique,
    Fname varchar(50) not null,
    Lname varchar(50),
    username varchar(50) not null unique,
    mypassword varchar(50),
    email varchar(50) not null,
    tel char(12) not null,
	profile_image VARCHAR(255),
    primary key(adminid)
);

create table product(
	foodid int not null auto_increment unique,
    foodname varchar(50) not null,
    detail varchar(200),
    price int not null,
    category varchar(50) not null,
    image varchar(255),
    primary key(foodid)
);

create table log_history(
    username varchar(30),
    pw varchar(30),
    saveLogin varchar(50)
);


select * from myadmin;
select * from product;
select * from log_history;

insert into product (foodname, detail, price, category, image) values 
("Chicken Crash", "หงอนสว่างเงางาม น่องที่เเรง 120 เเรงม้า วิ่งได้ 300 Km/Hr", 120, "Chicken", "1732883651053-Kai_Chon-removebg-preview.png"),
("Chicken Happy", "กินเเล้วเป็นไข่ไก่อารมณ์ดี ปลอดสารเสพติด 100%", 555, "Chicken", "1732883785392-CH_Kram_Toh-removebg-preview.png"),
("Coconut Chicken", "ไก่นะ ไม่ใช่ นกมะพร้าว", 50, "Chicken", "1732883862178-3d kiwi.png"),
("Beer", "มาเมากันเถอะจ้ะ", 127, "Drink", "1732883961856-1018.png_860-removebg-preview.png"),
("Water", "It TiME tO dRinK wAteR", 500, "Drink", "1732884031747-pngtree-water-bottle-png-image_13275849-removebg-preview.png"),
("Coca-Cola", "ดื่มเเทนน้ำเปล่าได้เลย", 10, "Drink", "1732884115033-pngtree-drink-recipes-png-image_13442920-removebg-preview.png"),
("Thai Tod", "Todd Yang rai", 202, "Snack&Desserts", "1732884250682-che_sss.jpg"),
("Baby Chicken", "เป็นลูกของ Happy Chicken", 199, "Snack&Desserts", "1732884311225-snack_nut_sa_ket-removebg-preview.png");

insert into myadmin(Fname, Lname, username, mypassword, email, tel, profile_image) values 
("Heang", "Kungs", "Heangkung", "33333333", "Heangkung@gmail.com", "083-333-3333", "1732881260493-heangkung.jpg"),
("Dew", "NongDor", "NongDor", "LoveTen", "Love10@gmail.com", "010-101-1001", "1732883199487-mem03.jpg"),
("New", "NokKiwi", "NokKiwi", "Nokkiwi555", "Nokkiwi@gmail.com", "094-555-2323", "1732883325672-mem02.jpg"),
("Next", "Coffee", "MewantCoffee", "BuyCoffeeIsGood", "Coffee.next@gmail.com", "000-000-0000", "1732883422535-mem01.jpg");
