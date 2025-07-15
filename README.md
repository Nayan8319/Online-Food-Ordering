🍽️ Foodie – Smart Online Food Ordering System
"Order food in seconds. Delight in every bite!" 😋
⚙️ Built with ASP.NET Core MVC + ReactJS + SQL Server + EF Core

🚀 Project Highlights
✨ One-Touch Food Ordering – Browse, click, and eat!

🔒 Role-Based Security – 🧑‍🍳 User & 🛡️ Admin panels

📈 Smart Analytics – Track top items, sales, and revenue

📱 Mobile Friendly – Works on phones, tablets, and desktops

🌐 Scalable Architecture – Ready for multi-vendor and mobile apps

🎯 Key Objectives
🍽️ Convenience – Order from anywhere

✅ Accuracy – Eliminate call/order mix-ups

📊 Admin Control – Manage menu, orders, users, and analytics

💡 Customer Delight – Smooth UI, fast updates

⚙️ Efficiency – Automate workflow

🧾 Digital Records – Fully paperless

📈 Growth-Ready – Modular and extensible

🧩 Core Features
👤 User Panel
🔐 Register / Login

🍴 Browse by Categories

🛒 Add to Cart & Checkout

💳 Secure Online Payments

🏠 Manage Delivery Addresses

📜 View Order History

🛠️ Admin Panel
🗂️ Manage Categories & Menu Items

✅ Approve Orders & Payments

📊 View Sales & Performance Reports

🧾 Inventory & Stock Monitoring

🔧 Tech Stack
Layer	Technology
🎨 Frontend	ReactJS, HTML5, CSS3, JavaScript
🔧 Backend	ASP.NET Core MVC (C#), RESTful APIs
🗄️ Database	SQL Server, Entity Framework Core
🧪 Dev Tools	Visual Studio, VS Code, Swagger
🔗 Version Control	Git + GitHub

🏗️ 3‑Tier Architecture
🎨 Presentation Layer – React components & UI

🧠 Business Layer – Controllers, Services (ASP.NET)

🗄️ Data Layer – SQL Server via EF Core ORM

🧪 Sample Test Cases
✅ Test Case	🧾 Input	📌 Expected Output	🧪 Status
Login/Register	Valid credentials	Redirect to dashboard	✅ Passed
Add to Cart	Product ID + Quantity	Cart updated	✅ Passed
Checkout	Valid payment + address	Order placed confirmation	✅ Passed
Admin Login	Admin credentials	Admin panel access	✅ Passed
View Reports	Date range	Sales report generated	✅ Passed

🗃️ Database Schema – SQL Server (via EF Core)
Designed to be clean, normalized, and scalable.

🔐 Role – User Roles
Column	Type	Constraint
RoleId	INT	🔑 Primary Key (Identity)
RoleName	VARCHAR(255)	❌ Not Null

👤 User – Customers & Admins
Column	Type	Constraint
UserId	INT	🔑 Primary Key (Identity)
Username	VARCHAR(255)	💎 Unique, ❌ Not Null
Email	VARCHAR(255)	💎 Unique, ❌ Not Null
Password	VARCHAR(255)	❌ Not Null
RoleId	INT	🔗 Foreign Key → Role.RoleId
CreatedDate	DATETIME	🕓 Default: GETDATE()

🍽️ Category – Food Categories
Column	Type	Constraint
CategoryId	INT	🔑 Primary Key
Name	VARCHAR(255)	❌ Not Null
IsActive	BIT	❌ Not Null
CreatedDate	DATETIME	🕓 Default: GETDATE()

🌮 Menu – Food Items
Column	Type	Constraint
MenuId	INT	🔑 Primary Key
Name	VARCHAR(255)	❌ Not Null
Price	DECIMAL(18,2)	❌ Not Null
Quantity	INT	❌ Not Null
CategoryId	INT	🔗 Foreign Key → Category.CategoryId
IsActive	BIT	❌ Not Null

🛒 Carts – Cart Items
Column	Type	Constraint
CartId	INT	🔑 Primary Key
MenuId	INT	🔗 Foreign Key → Menu.MenuId
UserId	INT	🔗 Foreign Key → User.UserId
Quantity	INT	❌ Not Null
TotalPrice	DECIMAL(18,2)	❌ Not Null

🏠 Address – Delivery Addresses
Column	Type	Constraint
AddressId	INT	🔑 Primary Key
UserId	INT	🔗 Foreign Key → User.UserId
Street	VARCHAR(255)	❌ Not Null
City	VARCHAR(255)	❌ Not Null
State	VARCHAR(255)	❌ Not Null
ZipCode	INT	❌ Not Null

💳 Payment – Payment Records
Column	Type	Constraint
PaymentId	INT	🔑 Primary Key
AddressId	INT	🔗 Foreign Key → Address.AddressId
PaymentMode	VARCHAR(255)	❌ Not Null (e.g., UPI, Card, COD)
TotalAmount	DECIMAL(18,2)	❌ Not Null
CreatedDate	DATETIME	🕓 Default: GETDATE()

📦 Orders – Order Tracking
Column	Type	Constraint
OrderId	INT	🔑 Primary Key
OrderNo	VARCHAR(50)	💎 Unique, ❌ Not Null
UserId	INT	🔗 Foreign Key → User.UserId
PaymentId	INT	🔗 Foreign Key → Payment.PaymentId
Status	VARCHAR(255)	❌ Not Null (e.g., Placed, Delivered)
OrderDate	DATETIME	🕓 Default: GETDATE()

📋 OrderDetails – Itemized Order Lines
Column	Type	Constraint
OrderDetailId	INT	🔑 Primary Key
OrderId	INT	🔗 Foreign Key → Orders.OrderId
MenuId	INT	🔗 Foreign Key → Menu.MenuId
Quantity	INT	❌ Not Null
Price	DECIMAL(18,2)	❌ Not Null

🌈 Future Enhancements
📱 Mobile App – Android & iOS

🗺️ Live Order Tracking

🎟️ Coupons & Rewards

🏪 Multi‑Restaurant Support

🧠 AI Recommendations

🤖 Chatbot Support

🖼️ UI Snapshots
See the screenshots/ folder for login, browsing, cart, checkout, and admin dashboards. Add more visuals as your app grows!

👨‍💻 Authors
Nayan Padhiyar Prakashbhai – @Nayan8319

Sarang Rishit Bhupendra – @Rishitsarang

Developed as part of M.Sc. (ICT) Semester II at J.P. Dawer Institute, Surat.

📄 License
This project is for educational purposes only. All rights reserved by the authors.
⭐ Don’t forget to STAR the repo if you found it useful!

