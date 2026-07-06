---
title: "Python 的 json 模块使用方法"
description: "梳理 Python json 模块的序列化、反序列化、自定义对象处理和常见参数用法。"
publishDate: "2025-04-05T10:21:48+08:00"
categories:
  - "Data Processing"
tags:
  - "Python"
draft: false
---

Python 的 json 模块提供了对 JSON 格式数据的编码和解码功能，可以方便地在 Python 对象和 JSON 格式之间进行转换。

## 基本功能

### JSON 字符串操作

（1）将 Python 对象转换为 JSON 字符串（`json.dumps()`）

```python
import json

data = {
    "name": "张三",
    "age": 30,
    "married": True,
    "children": ["小明", "小红"],
    "pets": None
}

json_string = json.dumps(data, ensure_ascii=False, indent=4)
print(json_string)
```

输出：

```json
{
    "name": "张三",
    "age": 30,
    "married": true,
    "children": [
        "小明",
        "小红"
    ],
    "pets": null
}
```

参数说明：

- `ensure_ascii=False`：确保非 ASCII 字符正常显示

- `indent=4`：美化输出，缩进 4 个空格

如果设置 `ensure_ascii=True`，则 `json.dumps()` 会将非 ASCII 字符强制转换为 ASCII 字符，结果将变成下面的样子：

```json
{
    "name": "\u5f20\u4e09",
    "age": 30,
    "married": true,
    "children": [
        "\u5c0f\u660e",
        "\u5c0f\u7ea2"
    ],
    "pets": null
}
```

（2）将 JSON 字符串转换为 Python 对象（`json.loads()`）

```python
json_str = '{"name": "李四", "age": 25, "city": "北京"}'
python_dict = json.loads(json_str)

print(python_dict["name"])  
# 李四
```

### JSON 文件操作

（1）写入 JSON 文件（`json.dump()`）

```python
data = {"name": "王五", "age": 35}

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
```

（2）读取 JSON 文件（`json.load()`）

```python
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(data)
# {"name": "王五", "age": 35}
```

## 高级用法

### 1. 自定义对象的 JSON 序列化

对于自定义类对象，可以通过定义 `__dict__` 方法或自定义编码函数来序列化类实例的值。

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# 方法 1：使用 __dict__
p = Person("赵六", 40)
print(json.dumps(p.__dict__, ensure_ascii=False))
# {"name": "赵六", "age": 40}

# 方法2：自定义编码函数
def person_encoder(obj):
    if isinstance(obj, Person):
        return {"name": obj.name, "age": obj.age}
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

print(json.dumps(p, default=person_encoder, ensure_ascii=False))
# {"name": "赵六", "age": 40}
```

### 2. 解析时使用 `object_hook` 参数

如果想将 JSON 字符串解析成类对象，可以使用 `object_hook` 参数。

```python
def person_decoder(dct):
    if "name" in dct and "age" in dct:
        return Person(dct["name"], dct["age"])
    return dct

json_str = '{"name": "钱七", "age": 45}'
p = json.loads(json_str, object_hook=person_decoder)
print(type(p))  
# <class '__main__.Person'>

print(p.name)
# 钱七

```

### 3. 处理日期时间对象

```python
from datetime import datetime

def datetime_encoder(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError("Type not serializable")

data = {"time": datetime.now()}
json_str = json.dumps(data, default=datetime_encoder)

print(json_str)
# {"time": "2025-04-03T11:03:10.541467"}

# 解析时通过 object_hook 转换回 datetime 对象
def datetime_decoder(dct):
    for k, v in dct.items():
        if k == "time":
            dct[k] = datetime.fromisoformat(v)
    return dct

data = json.loads(json_str, object_hook=datetime_decoder)
print(type(data["time"]))
# <class 'datetime.datetime'>

print(data['time'])
# 2025-04-03 11:03:10.541467
```

## 注意事项

（1）JSON 和 Python 数据类型对应关系：

||||
|---:|:---:|:---|
|JSON 对象| ↔ |Python 字典|
|JSON 数组| ↔ |Python 列表|
|JSON 字符串| ↔ |Python 字符串|
|JSON 数字| ↔ |Python int/float|
|JSON true/false| ↔ |Python True/False|
|JSON null| ↔ |Python None|

（2）确保 JSON 字符串格式正确，否则 `json.loads()` 会抛出 `json.JSONDecodeError` 异常。

（3）`json.dump()` 和 `json.dumps()` 的主要区别

|特性|json.dump()|json.dumps()|
|---|---|---|
|功能|将 Python 对象写入文件类对象|将 Python 对象转换为 JSON 字符串|
|输出目标|必须传入文件对象|返回字符串|
|名称含义|"dump" 表示转储到文件|"dumps" 表示 "dump to string"|
|使用场景|需要直接写入文件时|需要获得 JSON 字符串时|

（4）`json.load()` 和 `json.loads()` 的主要区别

|特性|json.load()|json.loads()|
|---|---|---|
|功能|从文件类对象读取并解析 JSON 数据|解析 JSON 格式的字符串|
|输入源|文件对象|JSON 字符串|
|名称含义|"load" 表示从文件加载|"loads" 表示 "load from string"|
|使用场景|从文件读取 JSON 数据时|处理字符串格式的 JSON 数据时|

<center>- EOF -</center>
