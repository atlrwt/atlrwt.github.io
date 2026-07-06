---
title: "SQL Server关于表和列的一些查询操作"
description: "整理 SQL Server 查询表结构、字段信息和元数据的常用 SQL 写法。"
publishDate: "2024-03-28T20:21:08+08:00"
categories:
  - "Data Analysis"
tags:
  - "SQL"
draft: false
---

## 写在前面

本文用于记录工作中SQL关于表和列的一些常用查询操作。

## 0. 数据准备

```sql
USE mydb
GO

CREATE TABLE Person (
    PersonID  INT,
    FirstName VARCHAR(20),
    LastName  VARCHAR(20),
    Age INT,
    LiveCity VARCHAR(255)
);

CREATE TABLE Occupation (
    PersonID INT,
    Company VARCHAR(50),
    Occupation VARCHAR(50)
);

CREATE TABLE OtherInfo (
    PersonID INT,
    MaritalStatus VARCHAR(10)
)
GO
```

## 1. 如何获取某个数据库中所有的表

```sql
USE mydb
GO

SELECT * FROM INFORMATION_SCHEMA.TABLES
```

结果如下：

```sql
   TABLE_CATELOG  TABLE_SCHEMA  TABLE_NAME  TABLE_TYPE
1  mydb           dbo           Person      BASE_TABLE
2  mydb           dbo           Occupation  BASE_TABLE
3  mydb           dbo           OtherInfo   BASE_TABLE
```

## 2. 如何获取某个表中所有列名

### 2.1 sys.columns

```sql
SELECT name
FROM mydb.sys.columns
WHERE object_id = OBJECT_ID('Person')
```

结果如下：

```sql
   name
1  PersonID
2  FirstName
3  LastName
4  Age
5  LiveCity
```

### 2.2 INFORMATION_SCHEMA

```sql
SELECT COLUMN_NAME
FROM mydb.INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Person'
```

结果如下：

```sql
   name
1  PersonID
2  FirstName
3  LastName
4  Age
5  LiveCity
```

### 2.3 SP_HELP

```sql
USE mydb
GO

SP_HELP Person
```

结果如下：

```sql
   Column_name  Type     ...
1  PersonID     int
2  FirstName    varchar
3  LastName     varchar
4  Age          int
5  LiveCity     varchar
```

### 2.4 SP_COLUMNS

```sql
USE mydb
GO

SP_COLUMNS Person
```

```sql
   TABLE_QUALIFIER  TABLE_OWNER  TABLE_NAME  COLUMN_NAME  ...
1  mydb             dbo          Person      PersonID
2  mydb             dbo          Person      FirstName
3  mydb             dbo          Person      LastName
4  mydb             dbo          Person      Age
5  mydb             dbo          Person      LiveCity
```

## 3. 查看某列都出现在了哪些表中

```sql
SELECT
    obj.name table_name,
    col.name col_name
FROM syscolumns col
INNER JOIN sysobjects obj
ON col.id = obj.id
AND obj.type = 'U'
WHERE col.name LIKE '%PersonID%'
ORDER BY obj.name
```

结果如下：

```sql
   table_name  col_name
1  Occupation  PersonID
2  OtherInfo   PersonID
3  Person      PersonID
```

## 4. 查看某列都出现在了哪些存储过程中

```sql
SELECT
    obj.name sp_name,
    sc.text  sp_content
FROM syscomments sc
INNER JOIN sysobjects obj ON sc.id = obj.id
WHERE sc.TEXT LIKE '%PersonID%'
AND TYPE = 'P'
```

<center>- EOF -</center>
