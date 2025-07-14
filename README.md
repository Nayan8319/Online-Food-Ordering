# 🍽️ Foodie – Smart Online Food Ordering System

**Foodie** is a powerful, full-stack 🍝 food ordering and delivery web application designed for local restaurants and cloud kitchens. It brings restaurant menus ✅ online, enables smooth checkout 💳, real-time tracking 📅, and admin management ⚖️—all packed in one sleek, secure system. Whether you're a vendor or a foodie 🥝, Foodie makes ordering food delightful!

> ⚡ **Built with ASP.NET Core MVC + ReactJS + SQL Server + EF Core**

---

## 🚀 Project Highlights

✨ **One-Touch Food Ordering** – Browse, add to cart, pay, and track with ease
🔒 **Secure & Role-Based Access** – Separate panels for Users & Admins
📈 **Live Reports & Analytics** – Track top-selling items and revenue
🌎 **Scalable for Growth** – Add more vendors, features, or mobile apps

---

## 🎯 Key Objectives

* 🍽️ **Digital Convenience** – Accessible from mobile, tablet, or PC anytime.
* ✅ **Improved Order Accuracy** – Reduces errors caused by phone calls.
* 📊 **Admin Dashboard** – Manage food, orders, reports, and users easily.
* 🌟 **Customer Satisfaction** – Clean UI, smooth ordering, trackable status.
* ⚙️ **Business Efficiency** – Less manual work, more automation.
* 🧾 **Paperless Transactions** – Fully digital from order to delivery.
* 📈 **Future-Ready Platform** – Modular and scalable architecture.

---

## 🧩 Core Features

### 👤 User Features

* 🔐 Register/Login
* 🛒 Add to Cart & Checkout
* 🗂️ Browse Food Categories
* 📜 View Order History
* 💳 Secure Payments
* 🏠 Manage Delivery Address

### 🛠️ Admin Features

* 🗃️ Manage Menu, Categories & Users
* ✅ Approve Orders & Payments
* 📈 Generate Reports
* 🧾 Inventory & Performance Monitoring

---

## 🔧 Tech Stack

| Layer              | Tech                               |
| ------------------ | ---------------------------------- |
| 🎨 Frontend        | ReactJS, HTML, CSS, JavaScript     |
| 🔧 Backend         | ASP.NET Core MVC, C#, RESTful APIs |
| 📊 Database        | SQL Server, Entity Framework Core  |
| 🧪 Dev Tools       | Visual Studio, VS Code, Swagger    |
| 🔗 Version Control | GitHub                             |

---

## 🕹️ Architecture - 3 Tier

1. **Presentation Layer** (ReactJS UI)
2. **Business Logic Layer** (ASP.NET Controllers & Services)
3. **Data Access Layer** (EF Core with SQL Server)

---

## 📊 Sample Test Cases

| 📄 Test        | 🔎 Input           | 🔢 Output         | 💪 Status |
| -------------- | ------------------ | ----------------- | --------- |
| Register/Login | Valid details      | Success dashboard | ✅         |
| Add to Cart    | Menu ID + Quantity | Cart updated      | ✅         |
| Checkout       | Payment details    | Order placed      | ✅         |
| Admin Login    | Admin credentials  | Admin dashboard   | ✅         |
| View Reports   | Date range         | Report generated  | ✅         |

---

## 📁 Database Schema

### 🏛 Role

| Column   | Type         | Constraint   |
| -------- | ------------ | ------------ |
| RoleId   | INT          | PK, Identity |
| RoleName | VARCHAR(255) | NOT NULL     |

### 👤 User

| Column      | Type         | Constraint         |
| ----------- | ------------ | ------------------ |
| UserId      | INT          | PK, Identity       |
| Username    | VARCHAR(255) | Unique, NOT NULL   |
| Email       | VARCHAR(255) | Unique, NOT NULL   |
| Password    | VARCHAR(255) | NOT NULL           |
| RoleId      | INT          | FK → Role(RoleId)  |
| CreatedDate | DATETIME     | Default: GETDATE() |

### 🍽️ Category

| Column      | Type         | Constraint         |
| ----------- | ------------ | ------------------ |
| CategoryId  | INT          | PK, Identity       |
| Name        | VARCHAR(255) | NOT NULL           |
| IsActive    | BIT          | NOT NULL           |
| CreatedDate | DATETIME     | Default: GETDATE() |

### 🌍 Menu

| Column     | Type          | Constraint                |
| ---------- | ------------- | ------------------------- |
| MenuId     | INT           | PK, Identity              |
| Name       | VARCHAR(255)  | NOT NULL                  |
| Price      | DECIMAL(18,2) | NOT NULL                  |
| Quantity   | INT           | NOT NULL                  |
| CategoryId | INT           | FK → Category(CategoryId) |
| IsActive   | BIT           | NOT NULL                  |

### 🛂 Carts

| Column     | Type          | Constraint        |
| ---------- | ------------- | ----------------- |
| CartId     | INT           | PK, Identity      |
| MenuId     | INT           | FK → Menu(MenuId) |
| UserId     | INT           | FK → User(UserId) |
| Quantity   | INT           | NOT NULL          |
| TotalPrice | DECIMAL(18,2) | NOT NULL          |

### 🏠 Address

| Column    | Type         | Constraint        |
| --------- | ------------ | ----------------- |
| AddressId | INT          | PK, Identity      |
| UserId    | INT          | FK → User(UserId) |
| Street    | VARCHAR(255) | NOT NULL          |
| City      | VARCHAR(255) | NOT NULL          |
| State     | VARCHAR(255) | NOT NULL          |
| ZipCode   | INT          | NOT NULL          |

### 💳 Payment

| Column      | Type          | Constraint              |
| ----------- | ------------- | ----------------------- |
| PaymentId   | INT           | PK, Identity            |
| AddressId   | INT           | FK → Address(AddressId) |
| PaymentMode | VARCHAR(255)  | NOT NULL                |
| TotalAmount | DECIMAL(18,2) | NOT NULL                |
| CreatedDate | DATETIME      | Default: GETDATE()      |

### 📆 Orders

| Column    | Type         | Constraint              |
| --------- | ------------ | ----------------------- |
| OrderId   | INT          | PK, Identity            |
| OrderNo   | VARCHAR(50)  | Unique, NOT NULL        |
| UserId    | INT          | FK → User(UserId)       |
| PaymentId | INT          | FK → Payment(PaymentId) |
| Status    | VARCHAR(255) | NOT NULL                |
| OrderDate | DATETIME     | Default: GETDATE()      |

### 📃 OrderDetails

| Column        | Type          | Constraint           |
| ------------- | ------------- | -------------------- |
| OrderDetailId | INT           | PK, Identity         |
| OrderId       | INT           | FK → Orders(OrderId) |
| MenuId        | INT           | FK → Menu(MenuId)    |
| Quantity      | INT           | NOT NULL             |
| Price         | DECIMAL(18,2) | NOT NULL             |

---

## 📈 Future Enhancements

* 📱 Mobile App (Android/iOS support)
* 🌐 Live Order Tracking on Maps
* 🎁 Coupons, Loyalty, and Rewards
* 🏢 Multi-Restaurant Support (like Swiggy/Zomato)
* 🤔 AI-based Recommendations
* 🔎 Chatbot for Customer Support

---

## 🖼️ UI Snapshots

> Below are the actual UI snapshots of the Foodie web app as described in the system documentation. These interfaces represent real-time interaction flows between the user, admin, and system components, making the user experience intuitive, visually clean, and mobile-friendly.

### 🔑 Login Page

![Login](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/Login.png)

### 📝 Registration Page

![Register](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/Register.png)

### 🏠 Home Page

![Home](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/Home.png)

### 🍽️ Menu Page

![Menu](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/Menu.png)

### 🛒 Cart Page

![Cart](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/Cart.png)

### 💳 Checkout Page

![Checkout](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/Checkout.png)

### 📬 Add Address Page

![Add Address](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/AddAddress.png)

### 📜 Order History

![Order History](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/OrderHistory.png)

### 👨‍💼 Admin Dashboard

![Admin Dashboard](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/AdminDashboard.png)

### 🧾 Manage Orders

![Manage Orders](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/ManageOrders.png)

### 🗂️ Manage Categories

![Manage Categories](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/ManageCategories.png)

### 🧾 Add/Edit Menu

![Menu Management](https://github.com/Nayan8319/Foodie-System/blob/main/screenshots/MenuManagement.png)

> 📂 All UI assets are stored in the `/screenshots/` folder and auto-loaded when the README is rendered on GitHub.

Coming Soon: Login Page | Menu List | Cart Page | Checkout | Admin Dashboard

---

## 👨‍💻 Authors

| 👨‍💼 Name                 | 🔗 GitHub Profile                                |
| -------------------------- | ------------------------------------------------ |
| Nayan Padhiyar Prakashbhai | [@Nayan8319](https://github.com/Nayan8319)       |
| Sarang Rishit Bhupendra    | [@Rishitsarang](https://github.com/Rishitsarang) |

> 🎓 Developed as part of **M.Sc. (ICT) Semester II** at JP Dawer Institute, Surat.

---

## 📚 License

This project is for **educational purposes only**. All rights reserved by the authors.

---

> ✨ *"We built Foodie to make food ordering easier, faster, and smarter — one bite at a time!"*

⭐ Don’t forget to **STAR** this repo if you liked it!
