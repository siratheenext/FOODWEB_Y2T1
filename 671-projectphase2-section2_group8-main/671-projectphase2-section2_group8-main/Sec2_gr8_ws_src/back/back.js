const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const fs = require('fs');
const multer = require('multer');
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3030',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE, // ฐานข้อมูลที่ใช้
});

// ใช้ body-parser เพื่อรับข้อมูลจาก POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

connection.connect(function(err){
    if (err) throw err;
    console.log(`Connected to DB: Chicknext`);
});

// ============================ Admin Routes ============================

// GET: Fetch all admins
app.get("/admin_data", (req, res) => {
    const sql = `SELECT * FROM myadmin ORDER BY adminid;`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        res.send(result);
    });
});

app.get('/admin_data/:adminid', (req, res) => {
    const { adminid } = req.params;
    const sql = 'SELECT * FROM myadmin WHERE adminid = ?';
    connection.query(sql, [adminid], (error, results) => {
        if (error) {
            console.error('Error fetching admin data:', error);
            return res.status(500).send('Error fetching admin data');
        }
        if (results.length === 0) {
            return res.status(404).send('Admin not found');
        }
        res.send(results[0]); // ส่งข้อมูลแถวแรก
    });
});

// POST: Add admin
app.post("/add_admin", upload.single('profileImage'), (req, res) => {
    const { firstName, lastName, username, password, email, tel } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const sql = `INSERT INTO myadmin (Fname, Lname, username, mypassword, email, tel, profile_image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [firstName, lastName, username, password, email, tel, profileImage], (error, result) => {
        if (error) return res.status(500).send("Error inserting admin");
        res.redirect("http://localhost:3030/admin");
    });
});

// DELETE: Delete admin
app.delete("/admin_data/:adminid", (req, res) => {
    const { adminid } = req.params;

    const getImageSql = `SELECT profile_image FROM myadmin WHERE adminid = ?`;
    connection.query(getImageSql, [adminid], (error, results) => {
        if (error) return res.status(500).send("Error fetching admin");

        if (results.length === 0) return res.status(404).send("Admin not found");

        const imageName = results[0].profile_image;
        const deleteSql = `DELETE FROM myadmin WHERE adminid = ?`;

        connection.query(deleteSql, [adminid], (deleteError, deleteResult) => {
            if (deleteError) return res.status(500).send("Error deleting admin");

            if (imageName) {
                const imagePath = path.join(__dirname, "uploads", imageName);
                fs.unlink(imagePath, (unlinkError) => {
                    if (!unlinkError) console.log(`Image deleted: ${imagePath}`);
                });
            }
            res.send("Admin and associated image deleted successfully");
        });
    });
});

// PUT: Update admin
app.put("/admin_data/:adminid", upload.single('profileImage'), (req, res) => {
    const { adminid } = req.params;
    const { firstName, lastName, username, password, email, tel } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    let sql = `UPDATE myadmin SET Fname = ?, Lname = ?, username = ?, mypassword = ?, email = ?, tel = ? WHERE adminid = ?`;
    const values = [firstName, lastName, username, password, email, tel, adminid];

    if (profileImage) {
        sql = `UPDATE myadmin SET Fname = ?, Lname = ?, username = ?, mypassword = ?, email = ?, tel = ?, profile_image = ? WHERE adminid = ?`;
        values.splice(6, 0, profileImage);
    }

    connection.query(sql, values, (error) => {
        if (error) return res.status(500).send("Error updating admin");
        res.send("Admin updated successfully");
    });
});

// ============================ Product Routes ============================

// GET: Fetch all products
app.get('/menu_data', (req, res) => {
    const sql = 'SELECT * FROM product';
    connection.query(sql, (error, results) => {
        if (error) return res.status(500).send("Error fetching products");
        results.forEach(product => {
            product.imageUrl = product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : '/img/default-image.png';
        });
        res.json(results);
    });
});

app.get('/menu_data/:foodid', (req, res) => {
    const { foodid } = req.params;
    const sql = 'SELECT * FROM product WHERE foodid = ?';
    connection.query(sql, [foodid], (error, results) => {
        if (error) {
            console.error('Error fetching product data:', error);
            return res.status(500).send('Error fetching product data');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        const product = results[0];
        product.imageUrl = product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : null; // เพิ่ม URL ของรูปภาพ
        res.send(product); // ส่งข้อมูล product พร้อม URL รูปภาพ
    });
});
// POST: Add product
app.post("/add_menu", upload.single('menuImage'), (req, res) => {
    const { menuName, price, description, category } = req.body;
    const menuImage = req.file ? req.file.filename : null;

    const sql = `INSERT INTO product (foodname, detail, price, category, image) VALUES (?, ?, ?, ?, ?)`;
    connection.query(sql, [menuName, description, price, category, menuImage], (error) => {
        if (error) return res.status(500).send("Error adding product");
        res.redirect("http://localhost:3030/menu_admin");
    });
});

// DELETE: Delete product
app.delete("/delete_menu/:foodid", (req, res) => {
    const { foodid } = req.params;

    const getImageSql = `SELECT image FROM product WHERE foodid = ?`;
    connection.query(getImageSql, [foodid], (error, results) => {
        if (error) return res.status(500).send("Error fetching product");

        const imageName = results[0]?.image;
        const deleteSql = `DELETE FROM product WHERE foodid = ?`;

        connection.query(deleteSql, [foodid], (deleteError) => {
            if (deleteError) return res.status(500).send("Error deleting product");

            if (imageName) {
                const imagePath = path.join(__dirname, "uploads", imageName);
                fs.unlink(imagePath, () => console.log(`Image deleted: ${imagePath}`));
            }
            res.send("Product deleted successfully");
        });
    });
});

app.put("/edit_menu/:foodid", upload.single('menuImage'), (req, res) => {
    const { foodid } = req.params; // ID ของ product ที่จะอัปเดต
    const { menuName, price, description, category } = req.body;
    const menuImage = req.file ? req.file.filename : null;

    let sql, values;

    // หากไม่มีการอัปโหลดรูปใหม่ ให้แก้ไขเฉพาะข้อมูลที่เหลือ
    if (!menuImage) {
        sql = `UPDATE product SET foodname = ?, detail = ?, price = ?, category = ? WHERE foodid = ?`;
        values = [menuName, description, price, category, foodid];
    } else {
        // หากมีการอัปโหลดรูปใหม่ ให้แก้ไขข้อมูลและเปลี่ยนรูป
        sql = `UPDATE product SET foodname = ?, detail = ?, price = ?, category = ?, image = ? WHERE foodid = ?`;
        values = [menuName, description, price, category, menuImage, foodid];

        // ลบรูปภาพเก่าออกจากเซิร์ฟเวอร์ (หากมี)
        const getImageSql = `SELECT image FROM product WHERE foodid = ?`;
        connection.query(getImageSql, [foodid], (err, results) => {
            if (err) return res.status(500).send("Error fetching product image");

            const oldImageName = results[0]?.image;
            if (oldImageName) {
                const oldImagePath = path.join(__dirname, "uploads", oldImageName);
                fs.unlink(oldImagePath, (unlinkErr) => {
                    if (unlinkErr) console.error(`Failed to delete old image: ${oldImagePath}`);
                });
            }
        });
    }

    // อัปเดต product ในฐานข้อมูล
    connection.query(sql, values, (error) => {
        if (error) return res.status(500).send("Error updating product");
        res.send("Product updated successfully");
    });
});

// ============================ Authentication Route ============================

app.post("/sign-in", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const recaptcha = req.body.recaptcha;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }
    if(!recaptcha){
        return res.status(400).json({ error: "Please complete the reCAPTCHA"});
    }

    const secretKey = "6Ldf6YsqAAAAACVQOpsbUNkLa97Vk7noTCcSjRTR";
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`; //reCaptcha
    
    try {
        const recaptchaResponse = await fetch(verificationURL, { method: "POST" });
        const recaptchaResult = await recaptchaResponse.json();

        if (!recaptchaResult.success) {
            return res.status(400).json({ error: "reCAPTCHA verification failed." });
        }

        const sqlQuery = "SELECT * FROM myadmin WHERE username = ?";
        connection.query(sqlQuery, [username], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "An error occurred while processing your request." });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid username or password." });
            }

            const admin = results[0];

            if (password !== admin.mypassword) {  //เปลี่ยนให้เข้ากับดาต้าเบส
                return res.status(401).json({ error: "Invalid username or password." });
            }

            const sessionToken = `cookie-${new Date().getTime()}`;
            const cookieOptions = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            };
            res.cookie("cookie", sessionToken, cookieOptions);
            res.status(200).json({message: "Login successful", user: {username: admin.username}});

            const loginTime = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Format as 'YYYY-MM-DD HH:MM:SS'
            const loginQuery = "INSERT INTO log_history (username, pw, saveLogin) VALUES (?, ?, ?)";

            connection.query(loginQuery, [admin.username, admin.mypassword, loginTime], (insertErr) => {
            if (insertErr) {
                console.error("Error inserting login data:", insertErr);
                return res.status(500).json({error: "Failed to record login."});
            }
            console.log(`Login successful by ${username} at ${loginTime}`);
  
        });
        });
    } catch (err) {
        console.error("Error during reCAPTCHA verification:", err);
        return res.status(500).json({ error: "An error occurred while verifying reCAPTCHA." });
    }
});

// get menu
app.get('/menu_data/category/:category', (req, res) => {
    const { category } = req.params;
    const sql = 'SELECT * FROM product WHERE category = ?';
    connection.query(sql, [category], (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).send('Error fetching products');
        }
        results.forEach(product => {
            product.imageUrl = product.image 
                ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` 
                : '/img/default-image.png';
        });
        res.json(results);
    });
});

app.get('/products', (req, res) => {
    const { query, category, price, promotion } = req.query;

    let sql = `SELECT * FROM product WHERE 1=1`;
    const filters = [];

    // กรองตามคำค้นหาที่พิมพ์
    if (query) {
        sql += ` AND (LOWER(foodname) LIKE ? OR LOWER(category) LIKE ?)`;
        const searchPattern = `%${query.toLowerCase()}%`;
        filters.push(searchPattern, searchPattern);
    }

    // กรองตาม category ถ้ามีการเลือก
    if (category && category !== "None") {
        sql += ` AND category = ?`;
        filters.push(category);
    }

    // กรองตามราคา
    if (price) {
        if (price === "less than 50฿") {
            sql += ` AND price < 50`;
        } else if (price === "50฿ - 100฿") {
            sql += ` AND price BETWEEN 50 AND 100`;
        } else if (price === "more than 100฿") {
            sql += ` AND price > 100`;
        }
    }

    // กรองตามโปรโมชั่น
    if (promotion === 'true') {
        sql += ` AND promotion = true`;
    }

    connection.query(sql, filters, (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).send('Error fetching products');
        }

        results.forEach(product => {
            product.imageUrl = product.image 
                ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` 
                : '/img/default-image.png';
        });

        res.json(results);
    });
});

// ============================ Server ============================
app.listen(process.env.port, () => {
    console.log(`Server running on port ${process.env.port}`);
});
