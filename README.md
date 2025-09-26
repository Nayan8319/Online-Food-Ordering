# 🍽️ Foodie – Smart Online Food Ordering System

🌐 **Foodie** is a powerful, full-stack 🍝 food ordering and delivery web application designed for local restaurants and cloud kitchens. It brings restaurant menus ✅ online, enables smooth checkout 💳, real-time tracking 📅, and admin management ⚖️ — all packed in one sleek, secure system. Whether you're a vendor or a foodie 🥝, **Foodie makes ordering food delightful!**

> ⚡ ** Built with ASP.NET Core + ReactJS + SQL Server **

---

## 🚀 Project Highlights

✨ **One-Touch Food Ordering** – Browse, add to cart 🛒, pay 💳, and track 🍱 with ease.

🔒 **Secure & Role-Based Access** – Separate login panels for Users 👥 & Admins 👨‍💼.

📈 **Live Reports & Analytics** – Track top-selling items 🍕 and total revenue 💸.

🌎 **Scalable for Growth** – Add more vendors 🏪, features 💡, or mobile apps 📱.

---

## 🎯 Key Objectives

* 🍽️ **Digital Convenience** – Accessible from mobile 📱, tablet 📟, or PC 🖥️ anytime.
* ✅ **Improved Order Accuracy** – Reduces manual errors caused by phone calls ☎️.
* 📊 **Admin Dashboard** – Manage food 🥗, orders 🧾, reports 📈, and users 👥 easily.
* 🌟 **Customer Satisfaction** – Clean UI 🧼, smooth ordering 💨, trackable status 📦.
* ⚙️ **Business Efficiency** – Less manual work 🛠️, more automation 🤖.
* 🧾 **Paperless Transactions** – Fully digital 🌐 from order 🧾 to delivery 📬.
* 📈 **Future-Ready Platform** – Modular 🧩 and scalable 🧱 architecture.

---

## 🧩 Core Features

### 👤 User Features

* 🔐 **Register/Login**
* 🛒 **Add to Cart & Checkout**
* 🗂️ **Browse Food Categories**
* 📜 **View Order History**
* 💳 **Secure Payments**
* 🏠 **Manage Delivery Address**

### 🛠️ Admin Features

* 🗃️ **Manage Menu, Categories & Users**
* ✅ **Approve Orders & Payments**
* 📈 **Generate Reports**
* 🧾 **Inventory & Performance Monitoring**

---

## 🔧 Tech Stack

| 🏗️ Layer          | 🧠 Technology                      |
| ------------------ | ---------------------------------- |
| 🎨 Frontend        | ReactJS, HTML, CSS, JavaScript     |
| 🔧 Backend         | ASP.NET Core MVC, C#, RESTful APIs |
| 🗄️ Database       | SQL Server, Entity Framework Core  |
| 🧪 Dev Tools       | Visual Studio, VS Code, Swagger    |
| 🔗 Version Control | GitHub                             |

---

## 🕹️ Architecture - 3 Tier

1. 🧑‍🎨 **Presentation Layer** – Built with ReactJS UI 🖼️
2. 🧠 **Business Logic Layer** – ASP.NET Controllers & Services 🧾
3. 🗃️ **Data Access Layer** – EF Core with SQL Server 💾

---

## 🧪 Sample Test Cases

| ✅ Test         | 🔎 Input           | 📌 Expected Output | 🧪 Status |
| -------------- | ------------------ | ------------------ | --------- |
| Register/Login | Valid details      | Success Dashboard  | ✅ Passed  |
| Add to Cart    | Menu ID + Quantity | Cart Updated       | ✅ Passed  |
| Checkout       | Payment Details    | Order Placed       | ✅ Passed  |
| Admin Login    | Admin Credentials  | Admin Dashboard    | ✅ Passed  |
| View Reports   | Date Range         | Report Generated   | ✅ Passed  |

---

## 🗃️ Database Schema – SQL Server

### 🏛️ `Role`

| 🧾 Column  | 🧠 Type      | 🔐 Constraint   |
| ---------- | ------------ | --------------- |
| `RoleId`   | INT          | 🔑 PK, Identity |
| `RoleName` | VARCHAR(255) | ❌ NOT NULL      |

### 👤 `User`

| 🧾 Column     | 🧠 Type      | 🔐 Constraint         |
| ------------- | ------------ | --------------------- |
| `UserId`      | INT          | 🔑 PK, Identity       |
| `Username`    | VARCHAR(255) | 💎 Unique, ❌ Not Null |
| `Email`       | VARCHAR(255) | 💎 Unique, ❌ Not Null |
| `Password`    | VARCHAR(255) | ❌ Not Null            |
| `RoleId`      | INT          | 🔗 FK → Role(RoleId)  |
| `CreatedDate` | DATETIME     | 🕒 Default: GETDATE() |

### 🍽️ `Category`

| 🧾 Column     | 🧠 Type      | 🔐 Constraint         |
| ------------- | ------------ | --------------------- |
| `CategoryId`  | INT          | 🔑 PK, Identity       |
| `Name`        | VARCHAR(255) | ❌ NOT NULL            |
| `IsActive`    | BIT          | ❌ NOT NULL            |
| `CreatedDate` | DATETIME     | 🕒 Default: GETDATE() |

### 📋 `Menu`

| 🧾 Column    | 🧠 Type       | 🔐 Constraint                |
| ------------ | ------------- | ---------------------------- |
| `MenuId`     | INT           | 🔑 PK, Identity              |
| `Name`       | VARCHAR(255)  | ❌ NOT NULL                   |
| `Price`      | DECIMAL(18,2) | ❌ NOT NULL                   |
| `Quantity`   | INT           | ❌ NOT NULL                   |
| `CategoryId` | INT           | 🔗 FK → Category(CategoryId) |
| `IsActive`   | BIT           | ❌ NOT NULL                   |

### 🛍️ `Carts`

| 🧾 Column    | 🧠 Type       | 🔐 Constraint        |
| ------------ | ------------- | -------------------- |
| `CartId`     | INT           | 🔑 PK, Identity      |
| `MenuId`     | INT           | 🔗 FK → Menu(MenuId) |
| `UserId`     | INT           | 🔗 FK → User(UserId) |
| `Quantity`   | INT           | ❌ NOT NULL           |
| `TotalPrice` | DECIMAL(18,2) | ❌ NOT NULL           |

### 🏠 `Address`

| 🧾 Column   | 🧠 Type      | 🔐 Constraint        |
| ----------- | ------------ | -------------------- |
| `AddressId` | INT          | 🔑 PK, Identity      |
| `UserId`    | INT          | 🔗 FK → User(UserId) |
| `Street`    | VARCHAR(255) | ❌ NOT NULL           |
| `City`      | VARCHAR(255) | ❌ NOT NULL           |
| `State`     | VARCHAR(255) | ❌ NOT NULL           |
| `ZipCode`   | INT          | ❌ NOT NULL           |

### 💳 `Payment`

| 🧾 Column     | 🧠 Type       | 🔐 Constraint              |
| ------------- | ------------- | -------------------------- |
| `PaymentId`   | INT           | 🔑 PK, Identity            |
| `AddressId`   | INT           | 🔗 FK → Address(AddressId) |
| `PaymentMode` | VARCHAR(255)  | ❌ NOT NULL                 |
| `TotalAmount` | DECIMAL(18,2) | ❌ NOT NULL                 |
| `CreatedDate` | DATETIME      | 🕒 Default: GETDATE()      |

### 📆 `Orders`

| 🧾 Column   | 🧠 Type      | 🔐 Constraint              |
| ----------- | ------------ | -------------------------- |
| `OrderId`   | INT          | 🔑 PK, Identity            |
| `OrderNo`   | VARCHAR(50)  | 💎 Unique, ❌ NOT NULL      |
| `UserId`    | INT          | 🔗 FK → User(UserId)       |
| `PaymentId` | INT          | 🔗 FK → Payment(PaymentId) |
| `Status`    | VARCHAR(255) | ❌ NOT NULL                 |
| `OrderDate` | DATETIME     | 🕒 Default: GETDATE()      |

### 📃 `OrderDetails`

| 🧾 Column       | 🧠 Type       | 🔐 Constraint           |
| --------------- | ------------- | ----------------------- |
| `OrderDetailId` | INT           | 🔑 PK, Identity         |
| `OrderId`       | INT           | 🔗 FK → Orders(OrderId) |
| `MenuId`        | INT           | 🔗 FK → Menu(MenuId)    |
| `Quantity`      | INT           | ❌ NOT NULL              |
| `Price`         | DECIMAL(18,2) | ❌ NOT NULL              |

---

## 📸 UI Snapshots

> 📂 Store screenshots in the `/screenshots` folder:

* 🔐 Login Page
* 📝 Registration Page
* 🏠 Home Page
* 🍽️ Menu Page
* 🛒 Cart Page
* 💳 Checkout Page
* 📬 Add Address Page
* 📜 Order History
* 👨‍💼 Admin Dashboard
* 🧾 Manage Orders
* 🗂️ Manage Categories
* ✏️ Add/Edit Menu

---

## 👨‍💻 Authors

| 👨‍🎓 Name                 | 🌐 GitHub Profile                                |
| -------------------------- | ------------------------------------------------ |
| Nayan Padhiyar Prakashbhai | [@Nayan8319](https://github.com/Nayan8319)       |
| Sarang Rishit Bhupendra    | [@Rishitsarang](https://github.com/Rishitsarang) |

> 🎓 M.Sc. (ICT) Semester II Project at JP Dawer Institute, Surat

---

## 📚 License

⚠️ This repository is for **educational purposes only**. All rights reserved by the developers.

---

> ✨ *“We built Foodie to make food ordering easier, faster, and smarter — one bite at a time!”*

🌟 Don’t forget to **STAR** this repo if you liked it!
