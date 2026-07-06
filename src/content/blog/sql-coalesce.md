---
title: "COALESCE函数的用法及常见注意事项"
description: "说明 SQL 中 COALESCE 函数的空值处理逻辑、典型用法和注意事项。"
publishDate: "2025-02-24T20:53:25+08:00"
categories:
  - "Data Analysis"
tags: []
draft: false
---

## TL-DR

SQL中的`COALESCE`函数会接收一个参数列表并返回其中的第一个非空值，它常用于处理字段中可能包含`NULL`值的情况，以确保查询结果中始终有一个有效的值。

其基本语法如下：

```sql
COALESCE(expression1, expression2, ..., expressionN)
```

在使用时有几个注意事项：

1. 应把优先级高的参数往前放。
2. 尽量避免在参数中使用复杂的计算或子查询。
3. 应确保所有参数的数据类型一致或兼容。
4. 要考虑到所有参数都为`NULL`的情况。

## 用法

`COALESCE`是SQL中的一个常用函数，用于返回参数列表中的第一个非空值。它通常用于处理可能包含NULL值的数据，确保在计算或显示时不会因为`NULL`值而出现问题。

### 基本语法

`COALESCE`函数的基本语法如下：

```sql
COALESCE(expression1, expression2, ..., expressionN)
```

- `expression1, expression2, ..., expressionN`：要检查的表达式列表。

`COALESCE`函数会从左到右依次检查每个表达式，返回第一个非空表达式的值。如果所有表达式的值都为`NULL`，则返回`NULL`。

### 示例

假设我们有一个名为`employees`的表，存储员工的基本信息，包括`id`、`name`、`phone`、`email`、`address`、`salary`和`bonus`。其中`phone`、`email`、`address`和`bonus`的字段值都可能为`NULL`。

```sql
-- 示例表创建与数据插入
CREATE TABLE employees (
  id      INT         PRIMARY KEY,
  name    VARCHAR(50)            ,
  phone   VARCHAR(15)            ,
  email   VARCHAR(50)            ,
  address VARCHAR(100)           ,
  salary  DECIMAL(10, 2)         ,
  bonus   DECIMAL(10, 2)
);

INSERT INTO employees (id, name, phone, email, address, salary, bonus) VALUES
(1, 'Alice', '123-456-7890', 'alice@example.com', '123 Main St', 5000.00, 1000.00),
(2, 'Bob', NULL, 'bob@example.com', '456 Elm St', 6000.00, NULL),
(3, 'Charlie', NULL, NULL, '789 Oak St', 7000.00, NULL),
(4, 'David', '987-654-3210', NULL, '321 Pine St', 8000.00, 1500.00),
(5, 'Emma', NULL, NULL, NULL, 4000.00, NULL);
```

我们先来预览一下表中的数据：

```sql
SELECT * FROM employees ORDER BY id;
```

|id|name|phone|email|address|salary|bonus|
|--|----|-----|-----|-------|------|-----|
|1|Alice|123-456-7890|alice@example.com|123 Main St|5000|1000|
|2|Bob||bob@example.com|456 Elm St|6000||
|3|Charlie|||789 Oak St|7000||
|4|David|987-654-3210||321 Pine St|8000|1500|
|5|Emma||||4000||

#### 示例1：处理单个列中的`NULL`值

假设我们想要查询每个员工的总收入（`salary` + `bonus`），由于`bonus`值可能为`NULL`，为确保计算能够正常进行，我们可以使用`COALESCE`将`NULL`替换为`0`。

```sql
SELECT
      name, 
      salary, 
      bonus, 
      salary + COALESCE(bonus, 0) AS total_income
FROM
      employees;
```

结果如下：

|name|salary|bonus|total_income|
|----|------|-----|------------|
|Alice|5000|1000|6000|
|Bob|6000||6000|
|Charlie|7000||7000|
|David|8000|1500|9500|
|Emma|4000||4000|

#### 示例2：处理多个列中的`NULL`值

假设我们想要查询员工的联系方式，数据口径为依次检查`phone`、`email`和`address`列，返回第一个非`NULL`的值，如果所有列都为`NULL`，则返回`No contact info`。

我们可以通过`COALESCE`来实现这一效果：

```sql
SELECT
       name, 
       COALESCE(phone, email, address, 'No contact info') AS primary_contact
FROM
      employees;
 ```

结果如下：

|name|primary_contact|
|----|---------------|
|Alice|123-456-7890|
|Bob|bob@example.com|
|Charlie|789 Oak St|
|David|987-654-3210|
|Emma|No contact info|

## 注意事项

### 1. 参数顺序的重要性

`COALESCE`函数会从左到右依次检查每个参数，并返回第一个非`NULL`的值，因此参数的顺序非常重要。

如果我们希望某个值优先于其他值被返回，则应将其放在参数列表的前面。

### 2. 性能考虑

由于`COALESCE`会对每个参数进行求值，直到找到第一个非空值。如果参数中包含复杂的表达式或子查询可能会影响查询性能。因此，在使用时应尽量避免在参数中出现复杂表达式或子查询。

### 3. 数据类型的一致性

`COALESCE`函数的参数应具有相同或兼容的数据类型，如果参数的数据类型不一致，可能会导致隐式类型转换，进而引发错误或意外的结果。

### 4. 处理所有参数为`NULL`的情况

如果`COALESCE`函数的所有参数都为`NULL`，则函数会返回`NULL`，这不一定是我们想要的结果。

因此，在设计查询时，应确保至少有一个参数为非空值，比如在必要时提供一个默认值或提供处理`NULL`的逻辑。

<center>- EOF -</center>
