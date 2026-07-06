---
title: "DISTINCT关键字的用法及常见注意事项"
description: "系统说明 DISTINCT 的去重逻辑、多列组合去重和在 SQL 查询中的常见误区。"
publishDate: "2025-02-18T20:50:42+08:00"
categories:
  - "Data Analysis"
tags:
  - "SQL"
draft: false
---

## TL-DR

`DISTINCT`可对单个/多个列的结果进行去重操作。

在使用时有如下几个注意事项：
1. `DISTINCT`的作用范围为一整行，而不是单个或某几列。
2. 在使用时要注意性能问题，数据量大时可以考虑使用`GROUP BY`。
3. 针对多个`NULL`值，`DISTINCT`结果只会保留一个。

## 正文

`DISTINCT`是SQL中的一个关键字，主要用于去除查询结果中重复的行，下面介绍其用法及常见注意事项。

### 用法

首先我们创建一个示例表并插入一些数据。

```sql
-- 创建一个示例表
CREATE TABLE employees (
id INT PRIMARY KEY,
department VARCHAR(50)
);

-- 插入一些示例数据
INSERT INTO employees (id, department) VALUES
(1, 'HR'),
(2, 'IT'),
(3, 'HR'),
(4, 'Finance');
```

#### 1. 对单个列使用`DISTINCT`

当我们希望从一个表中查询某一列的唯一值时，可以使用`DISTINCT`关键字。

```sql
SELECT DISTINCT department FROM employees;
```

| department |
| --- |
| HR |
| IT |
| Finance |

上述查询会返回`department`列中的唯一值，即去除了重复的`HR`。

#### 2. 对多个列使用DISTINCT

`DISTINCT`也可以应用于多个列，它会根据这些列的组合来去除重复的行。

首先我们调整一下`employees`表，添加一个`position`列并插入一些数据。

```sql
-- 假设表employees还有一个position列
ALTER TABLE employees ADD COLUMN position VARCHAR(50);
UPDATE employees SET position = 'Manager' WHERE id IN (1, 3);
UPDATE employees SET position = 'Developer' WHERE id = 2;
UPDATE employees SET position = 'Accountant' WHERE id = 4;
```

此时表中的存储的数据如下：

```sql
SELECT * FROM employees;
```

|id|department|position|
|--|----------|--------|
|1|HR|Manager|
|2|IT|Developer|
|3|HR|Manager|
|4|Finance|Accountant|

接下来执行下面的查询命令：

```sql
SELECT DISTINCT department, position FROM employees;
```

|department|position|
|----------|--------|
|HR|Manager|
|IT|Developer|
|Finance|Accountant|

该查询会根据`department`和`position`列的组合来去除重复的行，返回这两列组合的唯一值，因此`id`为`1`和`3`的结果只会保留一个。

### 常见注意事项

#### 1. `DISTINCT`作用于整个行

`DISTINCT`会对查询结果的整行进行去重判断，而不是只针对某一个或几个指定列。例如，如果在`SELECT`语句中使用了`DISTINCT`，那么它会考虑所有`SELECT`列表中的列。

```sql
SELECT DISTINCT department, id FROM employees;
```

|department|id|
|----------|--------|
|HR|1|
|IT|2|
|HR|3|
|Finance|4|

这里会根据`department`和`id`列的组合来判断是否重复，虽然`department`中存在两个`HR`，但由于对应的`id`不同，因此`DISTINCT`将其视为两个不同的结果。

#### 2. 性能问题

在处理大量数据时使用`DISTINCT`可能会影响查询性能，因为数据库需要对结果集进行排序和比较来去除重复的行。

在这种情况下，可以考虑使用`GROUP BY`来替代`DISTINCT`。

```sql
-- 使用GROUP BY替代DISTINCT
SELECT department FROM employees GROUP BY department;
```

| department |
| --- |
| HR |
| IT |
| Finance |

#### 3. `NULL`值处理

`DISTINCT`会将`NULL`值视为相同的值进行去重。也就是说，如果某一列中有多个`NULL`值，`DISTINCT`只会保留一个。

```sql
-- 插入包含NULL值的数据
INSERT INTO employees (id, department) VALUES (5, NULL);
INSERT INTO employees (id, department) VALUES (6, NULL);
```

此时表中的存储的数据如下：

|id|department|position|
|--|----------|--------|
|1|HR|Manager|
|2|IT|Developer|
|3|HR|Manager|
|4|Finance|Accountant|
|5|||
|6|||

```sql
SELECT DISTINCT department FROM employees;
```

| department |
| --- |
| HR |
| IT |
| Finance |
| NULL |

查询结果中只会出现一个`NULL`值。

<center>- EOF -</center>
