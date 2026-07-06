---
title: "SQL Server获取某月月初与月末日期的方法"
description: "说明如何结合 DATEADD 和 DATEDIFF 获取 SQL Server 中某月月初与月末日期。"
publishDate: "2024-03-23T15:43:33+08:00"
categories:
  - "Data Analysis"
tags:
  - "SQL"
draft: false
---

## 0. TL-DR

如何根据给定日期（`@date`）获取其对应月份第一天和最后一天日期：

```sql
-- 当月第一天
DATEADD(month, DATEDIFF(month, 0, @date), 0)

-- 当月最后一天
DATEADD(month, DATEDIFF(month, -1, @date), -1)
```

## 1. 问题描述
当我们在使用SQL Server编写脚本时，有时需要根据某一给定日期获取其月初第一天和月末最后一天的日期，如何来实现呢？

## 2. 解决方法
这里要用到SQL Server的两个函数：`DATEADD`和`DATEDIFF`。

### 2.1 DATEADD()

我们先来看一下`DATEADD`的语法:

```sql
DATEADD(datepart, number, date)
- datepart：DATEADD函数要加上number的date部分，如year，month，week，day等。
- number：  DATEADD函数要加的具体数量。
- date：    用于DATEADD函数计算的具体日期。
```

简而言之`DATEADD`函数的作用就是将`date`参数的某一`datepart`按照`number`进行加减。还是有点抽象对吧，我们来看几个例子：

```sql
DECLARE @date date='2024-03-23'

SELECT 'year', DATEADD(year, 1, @date)    -- 将@date增加1年
UNION ALL
SELECT 'month', DATEADD(month, 1, @date)  -- 将@date增加1个月
UNION ALL
SELECT 'week', DATEADD(week, -1, @date)   -- 将@date减去1周
UNION ALL
SELECT 'day', DATEADD(day, +5, @date)    -- 将@date加5天
```

结果如下：
```sql
year   2025-03-23
month  2024-04-23
week   2024-03-16
day    2024-03-28
```

### 2.2 DATEDIFF()

同样的，我们先看一下`DATEDIFF`的语法:

```sql
DATEDIFF(datepart, startdate, enddate)
- datepart： DATEDIFF函数要比较的date部分，如year，month，week，day等。
- startdate：开始日期。
- enddate：  结束日期。

Return: INT（enddate和startdate之间基于datepart部分的差值）
```

简而言之`DATEDIFF`函数的作用就是按照`datepart`将`enddate`和`startdate`做差。我们再来看几个例子：

```sql
DECLARE @startdate date='2024-03-23'
DECLARE @enddate   date='2023-01-01'

SELECT 'year', DATEDIFF(year, @startdate, @enddate)
UNION ALL
SELECT 'month', DATEDIFF(month, @startdate, @enddate)
UNION ALL
SELECT 'week', DATEDIFF(week, @startdate, @enddate)
UNION ALL
SELECT 'day', DATEDIFF(day, @startdate, @enddate)
```

结果如下：
```sql
year   -1
month  -14
week   -63
day    -447
```

## 3. 解决思路

了解了`DATEADD`和`DATEDIFF`这两个函数，我们可以找到这样一个解决思路：
- 获取当月第一天：通过`DATEDIFF`获取目标日期和`1900-01-01`基准日期之间月份的差值，然后利用`DATEADD`将基准日期加上差值得到目标月份第一天的日期。
- 获取当月最后一天：通过`DATEDIFF`获取目标日期和`1899-12-31`之间月份的差值，然后利用`DATEADD`将`1899-12-31`加上差值得到目标月份最后一天的日期。

```sql
DECLARE @date date='2024-03-23'

SELECT 'FirstDay', DATEADD(month, DATEDIFF(month, 0, @date), 0)
UNION ALL
SELECT 'LastDay', DATEADD(month, DATEDIFF(month, -1, @date), -1)
```

```sql
FirstDay 2024-03-01 00:00:00.000
LastDay  2024-03-31 00:00:00.000
```

<center>- EOF -</center>
