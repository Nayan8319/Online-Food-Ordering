CREATE DATABASE FoodieOrderning;
GO


USE FoodieOrderning;
GO

CREATE TABLE Role (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName VARCHAR(255) NOT NULL
);

CREATE TABLE [User] (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Mobile VARCHAR(15) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    ImageUrl VARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    CreatedDate DATETIME NOT NULL,
    IsVerified BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (RoleId) REFERENCES Role(RoleId)
);

CREATE TABLE Category (
    CategoryId INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    ImageUrl VARCHAR(255) NOT NULL,
    IsActive BIT NOT NULL,
    CreatedDate DATETIME NOT NULL
);

CREATE TABLE Menu (
    MenuId INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    ImageUrl VARCHAR(255) NOT NULL,
    CategoryId INT NOT NULL,
    IsActive BIT NOT NULL,
    CreatedDate DATETIME NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Category(CategoryId)
);

CREATE TABLE Address (
    AddressId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    Street VARCHAR(255) NOT NULL,
    City VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    ZipCode INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES [User](UserId)
);

CREATE TABLE Carts (
    CartId INT PRIMARY KEY IDENTITY(1,1),
    MenuId INT NOT NULL,
    Quantity INT NOT NULL,
    UserId INT NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId),
    FOREIGN KEY (UserId) REFERENCES [User](UserId)
);

CREATE TABLE Payment (
    PaymentId INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    CartId INT NOT NULL,
    ExpiryDate DATETIME NOT NULL,
    CvvNo INT NOT NULL,
    AddressId INT NOT NULL,
    PaymentMode VARCHAR(255) NOT NULL,
    FOREIGN KEY (CartId) REFERENCES Carts(CartId),
    FOREIGN KEY (AddressId) REFERENCES Address(AddressId)
);

CREATE TABLE Orders (
    OrderId INT PRIMARY KEY IDENTITY(1,1),
    OrderNo VARCHAR(50) NOT NULL UNIQUE,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UserId INT NOT NULL,
    Status VARCHAR(255) NOT NULL,
    PaymentId INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    FOREIGN KEY (ProductId) REFERENCES Menu(MenuId),
    FOREIGN KEY (UserId) REFERENCES [User](UserId),
    FOREIGN KEY (PaymentId) REFERENCES Payment(PaymentId)
);

CREATE TABLE Contact (
    ContactId INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Subject VARCHAR(255) NOT NULL,
    Message VARCHAR(255) NOT NULL,
    CreatedDate DATETIME NOT NULL
);


INSERT INTO Role (RoleName) VALUES ('Admin');
INSERT INTO Role (RoleName) VALUES ('User');

SELECT * FROM [User];

SELECT * FROM Category;

SELECT * FROM Menu;
-- Altering User table
ALTER TABLE [User]
ALTER COLUMN ImageUrl VARCHAR(MAX);

-- Altering Category table
ALTER TABLE Category
ALTER COLUMN ImageUrl VARCHAR(MAX);

-- Altering Menu table
ALTER TABLE Menu
ALTER COLUMN ImageUrl VARCHAR(MAX);

-- Insert an Admin user into the User table
INSERT INTO [User] (Name, Username, Mobile, Email, Password, ImageUrl, RoleId, CreatedDate, IsVerified)
VALUES ('AdminUser', 'admin123', '9876543210', 'admin@example.com', 'admin123', 'adminimageurl.jpg', 
        (SELECT RoleId FROM Role WHERE RoleName = 'Admin'), GETDATE(), 1);


DELETE FROM [User] WHERE UserId = 11;

INSERT INTO Category (Name, ImageUrl, IsActive, CreatedDate)
VALUES ('Category 1', 'image1.jpg', 1, GETDATE());

INSERT INTO Category (Name, ImageUrl, IsActive, CreatedDate)
VALUES ('Category 2', 'image2.jpg', 0, GETDATE());

INSERT INTO Category (Name, ImageUrl, IsActive, CreatedDate)
VALUES ('Category 3', 'image3.jpg', 1, GETDATE());

INSERT INTO Category (Name, ImageUrl, IsActive, CreatedDate)
VALUES ('Category 4', 'image4.jpg', 0, GETDATE());

INSERT INTO Category (Name, ImageUrl, IsActive, CreatedDate)
VALUES ('Category 5', 'image5.jpg', 1, GETDATE());



INSERT INTO Menu (Name, Description, Price, Quantity, ImageUrl, CategoryId, IsActive, CreatedDate)
VALUES ('Menu Item 1', 'Description for Menu Item 1', 10.99, 100, 'menu1.jpg', 1, 1, GETDATE());

INSERT INTO Menu (Name, Description, Price, Quantity, ImageUrl, CategoryId, IsActive, CreatedDate)
VALUES ('Menu Item 2', 'Description for Menu Item 2', 15.49, 50, 'menu2.jpg', 2, 0, GETDATE());

INSERT INTO Menu (Name, Description, Price, Quantity, ImageUrl, CategoryId, IsActive, CreatedDate)
VALUES ('Menu Item 3', 'Description for Menu Item 3', 12.79, 30, 'menu3.jpg', 3, 1, GETDATE());

INSERT INTO Menu (Name, Description, Price, Quantity, ImageUrl, CategoryId, IsActive, CreatedDate)
VALUES ('Menu Item 4', 'Description for Menu Item 4', 9.99, 200, 'menu4.jpg', 4, 0, GETDATE());

INSERT INTO Menu (Name, Description, Price, Quantity, ImageUrl, CategoryId, IsActive, CreatedDate)
VALUES ('Menu Item 5', 'Description for Menu Item 5', 8.49, 150, 'menu5.jpg', 5, 1, GETDATE());


SELECT 
    fk.name AS ForeignKeyName,
    tp.name AS TableName,
    cp.name AS ColumnName,
    tr.name AS ReferencedTableName,
    cr.name AS ReferencedColumnName
FROM 
    sys.foreign_keys fk
JOIN 
    sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
JOIN 
    sys.tables tp ON fkc.parent_object_id = tp.object_id
JOIN 
    sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
JOIN 
    sys.tables tr ON fkc.referenced_object_id = tr.object_id
JOIN 
    sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
WHERE 
    tp.name = 'Payment' AND cp.name = 'CartId';

-- Replace FK_Payment_Cart if you renamed it or used a specific name
ALTER TABLE Payment
DROP CONSTRAINT FK__Payment__CartId__239E4DCF;


ALTER TABLE Payment
DROP COLUMN CartId;


ALTER TABLE Payment
ADD TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0;

SELECT fk.name AS ForeignKeyName
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
JOIN sys.columns c ON fkc.parent_object_id = c.object_id AND fkc.parent_column_id = c.column_id
WHERE fk.parent_object_id = OBJECT_ID('Orders')
AND c.name = 'ProductId';


-- Step 1: Drop foreign key constraint on ProductId (replace FK name if different)
ALTER TABLE Orders DROP CONSTRAINT FK__Orders__ProductI__2C3393D0;

-- Step 2: Drop the columns ProductId and Quantity
ALTER TABLE Orders
DROP COLUMN ProductId, Quantity;


-- OrderDetails Table
CREATE TABLE OrderDetails (
    OrderDetailId INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    MenuId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId)
);

ALTER TABLE Orders
ADD TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0;

ALTER TABLE Payment
ADD CreatedDate DATETIME NOT NULL DEFAULT GETDATE();


EXEC sp_help 'Role';
EXEC sp_help 'User';
EXEC sp_help 'Category';
EXEC sp_help 'Menu';
EXEC sp_help 'Address';
EXEC sp_help 'Carts';
EXEC sp_help 'Payment';
EXEC sp_help 'Orders';
EXEC sp_help 'OrderDetails';
EXEC sp_help 'Contact';


