---
title: "玩转SQL Server字符串截取"
description: "汇总 SQL Server 中常见字符串截取、定位和组合函数的使用方式。"
publishDate: "2024-04-26T20:12:03+08:00"
categories:
  - "Data Analysis"
tags:
  - "SQL"
draft: false
---

## 写在前面

本文总结了SQL Server进行字符串截取时的常用方法，包括`LEFT`、`RIGHT`、`SUBSTRING`及`CHARINDEX`函数的使用。

## 入门

### `LEFT`函数

`LEFT`函数会从给定的字符串左侧开始截取指定数量的字符，例如：

```sql
SELECT LEFT('address', 5)
```

返回结果如下。

```sql
addre
```
### `RIGHT`函数

和`LEFT`函数类似，`RIGHT`函数会从给定的字符串右侧开始，向左截取指定数量的字符。

```sql
SELECT RIGHT('address', 5)
```

结果如下。

```sql
dress
```

### `SUBSTRING`函数

那如果想要从给定字符串中间开始截取字符该怎么办呢？`SUBSTRING`函数可以解决这个问题。

```sql
SELECT SUBSTRING('address', 2, 5)
```

通过`SUBSTRING`函数可以指定目标字符串的开始和结束位置，从而达到从中间截取字符串的目的。

```sql
ddres
```

## 进阶

上面这些基础的字符串截取操作可以应对大部分简单需求，但在面对更复杂的场景时就会显得力不从心。

例如，某个数据库字段存储了一段完整的JSON格式长字符串，我们需要从中提取出某一key值对应的value，由于每个JSON字符串中存储的内容都不相同，字符串长短不一，无法通过简单给定具体数值来截取字符串，此时又该怎么办呢？

这里我们需要借助`CHARINDEX`函数的帮助。

### `CHARINDEX`函数

`CHARINDEX`函数用于在指定字符串表达式中搜索目标字符串，若目标字符串存在则返回其在指定字符串中的位置，否则返回0。 它的语法如下：

```sql
CHARINDEX(expressionToFind, expressionToSearch, [, start_location])
```

> - expressionToFind：字符串表达式，包括要查找的字符串，限制长度8000字符。
> - expressionToSearch：要被查找的字符串表达式
> - start_location：可选参数，表示搜索开始位置的integer或bigint表达式。如果start_location未指定、具有负数值或0，搜索将从expressionToSearch的开头开始。

**返回类型**

如果expressionToSearch具有一个nvarchar(max)、varbinary(max)或varchar(max)数据类型，则为bigint；否则为int。例如:

```sql
SELECT CHARINDEX('CHARINDEX', 'This is a sample to test CHARINDEX function.')
```

```sql
26
```

需要注意，`CHARINDEX`的返回结果是从1开始计算的。

```sql
SELECT CHARINDEX('This', 'This is a sample to test CHARINDEX function.')
```

```sql
1
```

如果目标不存在，则会返回0。

```sql
SELECT CHARINDEX('sql', 'This is a sample to test CHARINDEX function.')
```

```sql
0
```

此外，`CHARINDEX`默认不区分大小写。

```sql
SELECT CHARINDEX('charindex', 'This is a sample to test CHARINDEX function.')
```

```sql
26
```

如想要进行区分大小写的搜索，可以使用`COLLATE`。

```sql
SELECT CHARINDEX('charindex', 'This is a sample to test CHARINDEX function.' COLLATE Latin1_General_CS_AS)
```

```sql
0
```

### 利用`SUBSTRING`和`CHARINDEX`实现字符串精确截取

假设我们有张叫做`PersonalInfo`的表，其中的`Basic_Information`字段存储了JSON格式的信息，里面包括`name`，`age`，`city`，`occupation`信息，现在我们想要查询表里面所有人的`name`和`occupation`信息并输出。

首先创建表。

```sql
CREATE TABLE #PersonalInfo (
    create_time DATE,
    Basic_Information NVARCHAR(MAX)
);
```

接下来插入一些测试数据。

```sql
INSERT INTO #PersonalInfo VALUES ('2024-04-19', '{"name": "张三", "age": "32", "city": "北京市", "occupation": "IT"}');
INSERT INTO #PersonalInfo VALUES ('2024-04-22', '{"name": "李四", "age": "25", "city": "上海市", "occupation": "Sales"}');
INSERT INTO #PersonalInfo VALUES ('2024-04-23', '{"name": "王五", "age": "46", "city": "广州市", "occupation": "Manufacture"}');
INSERT INTO #PersonalInfo VALUES ('2024-04-24', '{"name": "赵六", "age": "38", "city": "深圳市", "occupation": "Government"}');
```

**查询思路**

可以利用`SUBSTRING`+`CHARINDEX`来精准获取目标值。

```sql
SELECT
    SUBSTRING(Basic_Information,
              CHARINDEX('name', Basic_Information) + LEN('name') + 4,
              CHARINDEX('age',  Basic_Information) - (CHARINDEX('name', Basic_Information) + LEN('name') + 3) - 5) as name,
    SUBSTRING(Basic_Information,
              CHARINDEX('Occupation', Basic_Information) + LEN('Occupation') + 4,
              LEN(Basic_Information) - (CHARINDEX('Occupation', Basic_Information) + LEN('Occupation') + 4) - 1) as Occupation
FROM #PersonalInfo
```

```sql     name   Occupation
1    张三    IT
2    李四    Sales
3    王五    Manufacture
4    赵六    Government
```

## REFERENCE

[CHARINDEX (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/functions/charindex-transact-sql?view=sql-server-ver16)

<center>- EOF -</center>
