---
title: "Spark SQL中COLLECT_LIST函数的用法及常见注意事项"
description: "介绍 Spark SQL 中 COLLECT_LIST 函数的聚合行为、排序处理和常见使用限制。"
publishDate: "2025-02-27T21:29:07+08:00"
categories:
  - "Data Analysis"
tags: []
draft: false
---

## TL-DR

函数`COLLECT_LIST`用于将多行数据聚合为一个数组，其语法为：

```sql
COLLECT_LIST(expression)
```

- `expression`：待聚合的列或表达式。

常见注意事项：
1. `COLLECT_LIST`函数默认会忽略掉`NULL`值，如果想保留`NULL`值可以考虑使用`COALESCE`函数进行预处理。
2. `COLLECT_LIST`函数生成的结果顺序并不固定，可以通过`ARRAY_SORT`函数或者是子查询的方式来对结果进行排序。

## 用法

### 基本语法

`COLLECT_LIST`函数常见于`Spark SQL`、`Hive`、`PostgreSQL`等主流数据库中，它会将指定列的值按照分组条件合并为一个数组，其基本语法如下：

```sql
COLLECT_LIST(expression)
```

- `expression`：待聚合的列或表达式。

### 示例

我们首先创建一个示例表并插入一些数据。

```sql
-- 创建示例表
CREATE TABLE employees (
  dept_id  INT,
  emp_name STRING,
  salary   INT
);

-- 插入示例数据
INSERT INTO employees VALUES
(1, 'David', 8000),
(1, 'Charlie', 9000),
(2, 'Alice', 7000),
(2, NULL, 6000),
(3, 'Ele', 8000),
(3, 'Bob', NULL); 
```

表中数据如下：

| dept_id | emp_name | salary |
|---|---|---|
| 1 | Daivd | 8000 |
| 1 | Charlie | 9000 |
| 2 | Alice | 7000 |
| 2 | NULL | 6000 |
| 3 | Ele | 8000 |
| 3 | Bob | NULL |

假设我们想要收集员工的姓名列表并按部门分组，可以使用`COLLECT_LIST`函数来实现：

```sql
SELECT dept_id,
       COLLECT_LIST(emp_name) AS emp_names
  FROM employees
 GROUP BY dept_id
 ORDER BY dept_id;
```

执行上述查询后，结果如下：

| dept_id | emp_names |
|---|---|
| 1 | ["David","Charlie"] |
| 2 | ["Alice"] |
| 3 | ["Ele","Bob"] |

## 注意事项

### 1. `NULL`值的处理

`COLLECT_LIST`函数会自动忽略`NULL`值。例如上面的示例中，`emp_name`为`NULL`的员工并未被计算进结果中。

如果希望将`NULL`值的情况也包含进结果内，可以在使用`COLLECT_LIST`函数之前先使用`COALESCE`函数将`NULL`值进行替换：

```sql
SELECT dept_id
       ,COLLECT_LIST(COALESCE(emp_name, 'Unknown')) AS emp_name
  FROM employees
 GROUP BY dept_id
 ORDER BY dept_id;
```

如此，`dept_id`为`2`对应的`emp_names`里便多了一条`Unknown`结果。

| dept_id | emp_names |
|---|---|
| 1 | ["David","Charlie"] |
| 2 | ["Unknown","Alice"] |
| 3 | ["Ele","Bob"] |

### 2. 数组元素的顺序

`COLLECT_LIST`函数不能保证结果中数组元素的顺序是有序的。

如果需要结果有序可以考虑对聚合后的数据使用`SORT_ARRAY`函数进行排序：

```sql
SELECT dept_id
       ,SORT_ARRAY(COLLECT_LIST(emp_name)) AS sorted_emp_name
  FROM employees
 GROUP BY dept_id
 ORDER BY dept_id;
```

结果如下：

| dept_id | emp_names |
|---|---|
| 1 | ["Charlie","David"] |
| 2 | ["Alice","Unknown"] |
| 3 | ["Bob","Ele"] |

此外，在查询中先使用`ORDER BY`子句对数据进行排序，然后再使用`COLLECT_LIST`函数也可以实现类似的效果：

```sql
SELECT dept_id
       ,COLLECT_LIST(emp_name) AS sorted_emp_name
  FROM (
       SELECT dept_id
              ,COALESCE(emp_name, "Unknown") AS emp_name
         FROM employees
        ORDER BY dept_id, emp_name
       )
 GROUP BY dept_id
 ORDER BY dept_id;
```

| dept_id | emp_names |
|---|---|
| 1 | ["Charlie","David"] |
| 2 | ["Alice","Unknown"] |
| 3 | ["Bob","Ele"] |

<center>- EOF -</center>
