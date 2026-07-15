# 🚀 UserHub - Full Admin Panel

A modern **Admin Panel** built using **Node.js, Express.js, MongoDB, EJS, Bootstrap, and MVC Architecture**.

The project provides a complete management system for Users, Categories, Products, Authentication, and Role-Based Access Control.

---

# ✨ Features

## 🔐 Authentication

- ✅ User Registration
- ✅ User Login
- ✅ Secure Password Hashing (bcryptjs)
- ✅ Session Authentication
- ✅ Logout
- ✅ Route Protection
- ✅ Role-Based Authorization (Super Admin & Admin)

---

## 👤 User Management

- ➕ Add User
- 👀 View Users
- ✏️ Edit User
- 🗑️ Delete User
- 📸 Profile Image Upload
- 🔄 Status Toggle
- 👤 User Profile

---

## 📂 Category Management

- ➕ Add Category
- 👀 View Categories
- ✏️ Edit Category
- 🗑️ Delete Category
- 📸 Upload Category Image
- 🔄 Status Toggle

---

## 📁 Sub Category Management

- ➕ Add Sub Category
- 👀 View Sub Categories
- ✏️ Edit Sub Category
- 🗑️ Delete Sub Category
- 🔄 Status Toggle
- 🔗 Linked with Category

---

## 📦 Extra Sub Category Management

- ➕ Add Extra Sub Category
- 👀 View Extra Sub Categories
- ✏️ Edit Extra Sub Category
- 🗑️ Delete Extra Sub Category
- 🔄 Status Toggle
- 🔗 Linked with Sub Category

---

## 🛒 Product Management

- ➕ Add Product
- 👀 View Products
- 🔍 View Product Details
- ✏️ Edit Product
- 🗑️ Delete Product
- 🔄 Status Toggle
- 🖼️ Product Thumbnail Upload
- 🖼️ Multiple Gallery Images
- 🏷️ SKU Support
- 💰 Price & Sale Price
- 📦 Quantity Management
- 🔗 Category → Sub Category → Extra Sub Category Relationship

---

## 📊 Dashboard

- 👥 Total Users
- 📂 Total Categories
- 📁 Total Sub Categories
- 📦 Total Extra Sub Categories
- 🛒 Total Products
- 📈 Dashboard Statistics

---

## 📸 Image Upload

Image upload using **Multer** for:

- 👤 Users
- 📂 Categories
- 📁 Sub Categories
- 📦 Extra Sub Categories
- 🛒 Products

---

# 🛠️ Tech Stack

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB
- 🧩 Mongoose

### Frontend

- 📄 EJS
- 🎨 Bootstrap 5
- 🎨 HTML5
- 🎨 CSS3
- ⚡ JavaScript

### Authentication

- 🔐 Express Session
- 🔑 Passport.js
- 🔒 bcryptjs

### Other Packages

- 📸 Multer
- 🍪 Cookie Parser
- 💬 Connect Flash
- 🌱 dotenv

---

# 📂 Project Structure

```text
Full-Admin-Panel
│
├── 📁 config
│   ├── db.js
│   ├── passport.js
│   ├── userMulter.js
│   ├── categoryMulter.js
│   ├── subCategoryMulter.js
│   ├── extraSubCategoryMulter.js
│   └── productMulter.js
│
├── 📁 controllers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── profileController.js
│   ├── passwordController.js
│   ├── userController.js
│   ├── categoryController.js
│   ├── subCategoryController.js
│   ├── extraSubCategoryController.js
│   └── productController.js
│
├── 📁 middleware
│   ├── sessionAuth.js
│   └── roleAuth.js
│
├── 📁 models
│   ├── User.js
│   ├── Category.js
│   ├── SubCategory.js
│   ├── ExtraSubCategory.js
│   └── Product.js
│
├── 📁 routes
│   ├── authRoute.js
│   ├── dashboardRoute.js
│   ├── profileRoute.js
│   ├── passwordRoute.js
│   ├── userRoute.js
│   ├── categoryRoute.js
│   ├── subCategoryRoute.js
│   ├── extraSubCategoryRoute.js
│   └── productRoute.js
│
├── 📁 views
│   ├── auth
│   ├── dashboard
│   ├── users
│   ├── category
│   ├── subcategory
│   ├── extrasubcategory
│   ├── product
│   ├── partials
│   └── layouts
│
├── 📁 uploads
│   ├── users
│   ├── category
│   ├── subcategory
│   ├── extrasubcategory
│   └── product
│
├── 📁 public
│   ├── css
│   ├── js
│   └── images
│
├── app.js
├── package.json
├── .env
└── README.md
```

---

# 🏗️ MVC Architecture

```text
Client Request
      │
      ▼
   Routes
      │
      ▼
 Controllers
      │
      ▼
   Models
      │
      ▼
 MongoDB Database
      │
      ▼
 Controllers
      │
      ▼
 EJS Views
      │
      ▼
 Browser Response
```

---

# 🔄 Product Flow

```text
Category
    │
    ▼
Sub Category
    │
    ▼
Extra Sub Category
    │
    ▼
Product
```

---

# 🔒 Security Features

- 🔐 Password Encryption
- 🍪 Session Authentication
- 🛡️ Protected Routes
- 👮 Role-Based Authorization
- 📂 MVC Architecture
- 📸 Secure File Upload
- ✅ Server-Side Validation

---

# 🚀 Installation

```bash
git clone https://github.com/your-username/Full-Admin-Panel.git
```

```bash
cd Full-Admin-Panel
```

```bash
npm install
```

Create a **.env** file:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

Run the project:

```bash
npm start
```

or

```bash
nodemon app.js
```

Open your browser:

```
http://localhost:8000
```

---

# 👩‍💻 Author

**Prachi Parmar**

🎓 Full Stack Developer

---

DASHBOARD-PAGE :


<img width="1263" height="658" alt="dashboard-page" src="https://github.com/user-attachments/assets/a42c1d48-06e9-4cc3-adda-c35683639a7e" />

SIDEBAR ::


<img width="211" height="663" alt="sidebar" src="https://github.com/user-attachments/assets/74d7f45c-24f0-4716-9fbf-7088e23cab1d" />


CATEGORIES-PAGE ::


<img width="1015" height="489" alt="categories" src="https://github.com/user-attachments/assets/ac4390a9-3c78-4e4e-955f-08f5a2a5fc72" />


PRODUCT-LIST ::


<img width="1026" height="270" alt="product-list" src="https://github.com/user-attachments/assets/b6ffe095-f8fe-4fb8-9697-88d90d03dc8a" />


PRODUCT-DETAILS ::


<img width="1037" height="640" alt="Product-detail" src="https://github.com/user-attachments/assets/029a195f-c9f7-42e2-ac19-3d8d0e7d69ce" />



VIDEO-URL :: https://drive.google.com/file/d/1TIctegP_yFfrnh-KS0gR3Lb-2PT-Ut-_/view?usp=drive_link  


⭐ If you found this project helpful, consider giving it a **Star** on GitHub!
