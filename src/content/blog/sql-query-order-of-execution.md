---
title: "SQL 查询语句的书写顺序和执行顺序"
description: "对比 SQL 语句书写顺序和实际执行顺序，帮助理解查询结果的生成过程。"
publishDate: "2025-03-24T20:12:15+08:00"
categories:
  - "Data Analysis"
tags:
  - "SQL"
draft: false
---

## TL-DR

SQL 查询语句的书写和执行顺序：

|顺序|书写顺序|执行顺序|
|---|---|---|
|1|SELECT|FROM|
|2|FROM|JOIN|
|3|JOIN|WHERE|
|4|WHERE|GROUP BY|
|5|GROUP BY|HAVING|
|6|HAVING|SELECT|
|7|ORDER BY|ORDER BY|
|8|LIMIT|LIMIT|

## SQL 查询语句的书写顺序

在标准 SQL 中，一个完整的查询语句通常遵循以下书写顺序：

```sql
SELECT [DISTINCT] select_list
FROM left_table
[JOIN right_table ON join_condition]
[WHERE where_condition]
[GROUP BY group_by_list]
[HAVING having_condition]
[ORDER BY order_by_list]
[LIMIT offset, row_count];
```

各个子句的作用如下：
- `SELECT`：用于指定要查询的列，可以是表中的列名，也可以是表达式。其中的 `DISTINCT` 关键字用于去除查询结果中的重复行。
- `FROM`：指定要查询数据的表或视图。
- `JOIN`：用于将多个表进行连接操作，通过 `ON` 子句指定连接条件。
- `WHERE`：用于筛选满足指定条件的行。
- `GROUP BY`：将查询结果按照指定的列进行分组。
- `HAVING`：用于筛选分组后的结果，通常与 `GROUP BY` 子句一起使用。
- `ORDER BY`：对查询结果按照指定的列进行排序。
- `LIMIT`：用于限制查询结果返回的行数，`offset` 表示偏移量，`row_count` 表示返回的行数。

## SQL 查询语句的执行顺序

SQL 查询语句的执行顺序与书写顺序并不完全一致。实际的执行顺序如下：

- `FROM`：首先从 `FROM` 子句指定的表或视图中读取数据。
- `JOIN`：根据 `JOIN` 子句中的 `ON` 连接条件，将一个或多个表进行连接，生成一个临时结果表。
- `WHERE`：对临时结果表进行筛选，只保留满足 `WHERE` 子句中条件的行。
- `GROUP BY`：将筛选后的结果表按照 `GROUP BY` 子句中指定的列进行分组。
- 聚合函数：对 `GROUP BY`后的分组进行聚合计算。
- `HAVING`：对分组后的结果表进行筛选，只保留满足 `HAVING` 子句中条件的分组。
- `SELECT`：从上一步的结果表中选择 `SELECT` 子句中指定的列。
- `DISTINCT`：如果使用了 `DISTINCT` 关键字，会去除查询结果中的重复行。
- `ORDER BY`：对查询结果按照 `ORDER BY` 子句中指定的列进行排序。
- `LIMIT`：最后根据 `LIMIT` 子句限制查询结果返回的行数。

## 示例

对于下面这段查询语句：

```sql
SELECT DISTINCT
       department
       ,COUNT(*) AS employee_count
  FROM employees e
 INNER JOIN departments d
         ON e.department_id = d.department_id
 WHERE salary > 5000
 GROUP BY department
HAVING COUNT(*) > 5
 ORDER BY employee_count DESC
 LIMIT 0, 10;
```

其执行顺序如下：

- `FROM`：从 `employees` 表和 `departments` 表中读取数据。
- `INNER JOIN`：根据 `e.department_id = d.department_id` 条件将两个表进行内连接。
- `WHERE`：筛选出 `salary > 5000` 的行。
- `GROUP BY`：将筛选后的结果按照 `department` 列进行分组。
- `COUNT(*)`：计算各分组的员工数。
- `HAVING`：筛选出员工数量大于 `5` 的分组。
- `SELECT`：选择 `department` 列和每个分组的员工数量 `employee_count`。
- `DISTINCT`：去除查询结果中的重复行。
- `ORDER BY`：按照员工数量降序排序。
- `LIMIT`：返回前 `10` 条记录。

<center>- EOF -</center>
