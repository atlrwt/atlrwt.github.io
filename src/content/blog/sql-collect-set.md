---
title: "Spark SQL中COLLECT_SET函数的用法及常见注意事项"
description: "介绍 Spark SQL 中 COLLECT_SET 函数的去重聚合行为、排序问题和使用注意点。"
publishDate: "2025-03-06T20:46:46+08:00"
categories:
  - "Data Analysis"
tags: []
draft: false
---

## TL-DR
`COLLECT_SET`是`Spark SQL`中的聚合函数，用于将一组数据中的唯一值收集到一个集合中。其基本语法为：

```sql
COLLECT_SET(expression)
```

- `expression`：要收集的列或表达式。

不同于`COLLECT_LIST`函数，`COLLECT_SET`函数会自动去重，以确保集合中的每个元素都是唯一的。

常见注意事项：

1. `COLLECT_SET`函数默认会忽略掉`NULL`值，如果想保留`NULL`值可以考虑使用`COALESCE`函数进行预处理。
2. `COLLECT_SET`函数生成的结果顺序并不固定，可以通过`ARRAY_SORT`函数来对结果进行排序。

## 用法

### 基本语法

`COLLECT_SET`函数通常用于在分组查询中收集某一列的唯一值，它的基本语法如下：

```sql
COLLECT_SET(expression)
```

- `expression`：要收集的列或表达式。

### 示例

接下来我们通过一个例子来说明如何使用`COLLECT_SET`函数，首先创建示例表并插入一些数据。

```sql
-- 创建示例表
CREATE TABLE order (
    id           INT,
    customer_id  INT,
    product_name STRING
);

-- 插入数据
INSERT INTO sales VALUES
(1, 101, 'Apple'),
(2, 101, 'Banana'),
(3, 102, 'Apple'),
(4, 102, 'Orange'),
(5, 101, 'Banana'),
(6, 103, 'Apple'),
(7, 103, 'Orange'),
(8, 102, 'Banana'),
(9, 101, NULL),
(10, 103,'Banana');
```
假设我们希望为每个`customer_id`聚合其购买的所有产品并去重。可以使用`COLLECT_SET`函数来实现：

```sql
SELECT customer_id
       ,COLLECT_SET(product_name) AS unique_products
  FROM order
 GROUP BY customer_id
 ORDER BY customer_id;
```

结果如下：

|customer_id|unique_products|
|---|---|
|101| ["Apple","Banana"]|
|102| ["Orange","Apple","Banana"]|
|103| ["Orange","Apple","Banana"]|

从结果中可看出，`COLLECT_SET`函数成功地将每个`customer_id`中的唯一产品名称收集到了一个集合中。

## 注意事项

在使用`COLLECT_SET`函数时，有一些细节需要引起注意。

### 1. `NULL`值处理
`COLLECT_SET`函数默认会忽略`NULL`值。即如果列中包含`NULL`值，它们将不会被计入结果集合中。

对于需要保留`NULL`值的情况，可以考虑通过`COALESCE`函数进行预处理后再用`COLLECT_SET`函数进行聚合：

```sql
SELECT customer_id
       ,COLLECT_SET(COALESCE(product_name, "Unknown")) AS unique_products
  FROM order
 GROUP BY customer_id
 ORDER BY customer_id;
```

此时，`id = 9`对应的`NULL`值被转换为`Unknown`并聚合进了最终结果中。

| customer_id | unique_products |
|---|---|
|101| ["Apple","Unknown","Banana"]|
|102| ["Orange","Apple","Banana"]|
|103| ["Orange","Apple","Banana"]|

### 2. 结果顺序

`COLLECT_SET`函数返回结果中的元素顺序是不固定的。

对于需要按照特定顺序排列结果的情况，可以考虑对聚合后的结果使用`SORT_ARRAY`函数进行排序来实现：

```sql
SELECT customer_id
       ,SORT_ARRAY(COLLECT_SET(COALESCE(product_name, "Unknown"))) AS sorted_product_name
  FROM order
 GROUP BY customer_id
 ORDER BY customer_id;
 ```

| customer_id | sorted_product_name|
| --- |---|
|101|["Apple","Banana","Unknown"]|
|102|["Apple","Banana","Orange"]|
|103|["Apple","Banana","Orange"]|

在[介绍COLLECT_LIST函数的文章](/blog/sql-collect-list/)中我们曾经通过子查询的方式实现了同样的排序效果，**但需要注意的是**，这个方法并不适用于`COLLECT_SET`函数：

```sql
SELECT customer_id
       ,COLLECT_SET(product_name) AS sorted_product_name
  FROM (
       SELECT customer_id
              ,COALESCE(product_name, "Unknown") AS product_name
         FROM orca01_cis4_data.tmp_col_set
        ORDER BY customer_id, product_name
  )
  GROUP BY customer_id
  ORDER BY customer_id;
```

| customer_id | sorted_product_name|
| --- |---|
|101|["Apple","Unknown","Banana"]|
|102|["Orange","Apple","Banana"]|
|103|["Orange","Apple","Banana"]|

<center>- EOF -</center>
