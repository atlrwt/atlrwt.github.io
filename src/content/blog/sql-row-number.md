---
title: "ROW_NUMBER函数的用法及常见注意事项"
description: "说明 ROW_NUMBER 窗口函数的排序编号逻辑、分组用法和典型分析场景。"
publishDate: "2025-02-10T20:46:51+08:00"
categories:
  - "Data Analysis"
tags:
  - "SQL"
draft: false
---

## TL-DR

```sql
ROW_NUMBER() OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```

- `PARTITION BY`：可选参数，用于将结果集划分为多个分区，`ROW_NUMBER()`函数会在每个分区内独立地为行分配行号。
- `ORDER BY`：必选参数，用于指定对结果集或每个分区内的行进行排序的规则。

## 正文

### 语法

`ROW_NUMBER()`是 SQL 中的一个窗口函数，用于为结果集中的每一行分配一个唯一的行号。它按照指定的排序顺序对结果集进行排序，并为每行依次分配从`1`开始的连续整数。其语法如下：

```sql
ROW_NUMBER() OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```

- `PARTITION BY`：可选参数，用于将结果集划分为多个分区，`ROW_NUMBER()`函数会在每个分区内独立地为行分配行号。
- `ORDER BY`：必选参数，用于指定对结果集或每个分区内的行进行排序的规则。

### 示例

假设我们有一个名为`students`的表，用于存储学生的信息，包括学生ID、班级ID和成绩，表结构和示例数据如下：

```sql
-- 创建 students 表
CREATE TABLE students (
    student_id INT,
    class_id INT,
    score INT
);

-- 插入示例数据
INSERT INTO students (student_id, class_id, score) VALUES
(1, 1, 85),
(2, 1, 90),
(3, 1, 78),
(4, 2, 92),
(5, 2, 88),
(6, 2, 76);
```

#### 示例1：不使用 PARTITION BY

如果不使用`PARTITION BY`，`ROW_NUMBER()`函数会对整个结果集进行排序并分配行号。

```sql
SELECT
    student_id,
    class_id,
    score,
    ROW_NUMBER() OVER (ORDER BY score DESC) AS row_num
FROM
    students;
```

这个查询会对整个`students`表按照成绩降序排序，然后为每行分配一个从`1`开始的连续行号。结果如下：

| student_id | class_id | score | row_num |
|---|---|---|---|
|4 | 2 | 92 | 1 |
|2 | 1 | 90 | 2 |
|5 | 2 | 88 | 3 |
|1 | 1 | 85 | 4 |
|3 | 1 | 78 | 5 |
|6 | 2 | 76 | 6 |

#### 示例2：使用 PARTITION BY

当使用`PARTITION BY`时，`ROW_NUMBER()`函数会在每个分区内独立地为行分配行号。

```sql
SELECT
    student_id,
    class_id,
    score,
    ROW_NUMBER() OVER (PARTITION BY class_id ORDER BY score DESC) AS row_num
FROM
    students;
```

这个查询会将`students`表按照班级`ID`进行分区，然后在每个班级内按照成绩降序排序，并为每行分配一个从`1`开始的连续行号。结果如下：

| student_id | class_id | score | row_num |
|---|---|---|---|
| 2 | 1 | 90 | 1 |
| 1 | 1 | 85 | 2 |
| 3 | 1 | 78 | 3 |
| 4 | 2 | 92 | 1 |
| 5 | 2 | 88 | 2 |
| 6 | 2 | 76 | 3 |

#### 示例3：使用 ROW_NUMBER() 进行分页查询

`ROW_NUMBER()`函数还可以用于实现分页查询。假设每页显示2条记录，我们想查询第二页的信息：

```sql
-- 子查询为每行分配行号
WITH numbered_students AS (
    SELECT
        student_id,
        class_id,
        score,
        ROW_NUMBER() OVER (ORDER BY student_id) AS row_num
    FROM
        students
)
-- 外层查询筛选出指定页的记录
SELECT
    student_id,
    class_id,
    score
FROM
    numbered_students
WHERE
    row_num BETWEEN 3 AND 4;
```

上述查询首先通过子查询为`students`表中的每一行按照`student_id`进行排序，并为每行分配一个从`1`开始的连续行号。执行子查询后的中间结果如下：

| student_id | class_id | score | row_num |
|---|---|---|---|
| 1 | 1 | 85 | 1 |
| 2 | 1 | 90 | 2 |
| 3 | 1 | 78 | 3 |
| 4 | 2 | 92 | 4 |
| 5 | 2 | 88 | 5 |
| 6 | 2 | 76 | 6 |

然后外层查询会从上述中间结果中筛选出行号在`3`到`4`之间的记录，也就是筛选出第3行和第4行的数据。最终查询结果如下：

| student_id | class_id | score |
|---|---|---|
| 3 | 1 | 78 |
| 4 | 2 | 92 |

### 注意事项

- 唯一性: `ROW_NUMBER()`返回的序号在每个分组内是唯一的，但在不同的分组中可能会重复。
- 排序: `ORDER BY`子句是必需的，因为没有指定排序规则就无法确定如何分配行号。
- 性能: 在大型数据集上使用`ROW_NUMBER()`时，可能会影响查询性能，尤其是在没有适当索引的情况下。
- 无确定性: 如果在`ORDER BY`子句中使用的列的值相同，`ROW_NUMBER()`返回的结果可能不一致，最好在排序时使用唯一的列组合来确保一致性。

<center>- EOF -</center>
