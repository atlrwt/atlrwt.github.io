---
title: "(施工中）Python unittest 模块使用手册 - 基础篇"
description: "从测试用例、测试套件到断言方法，系统整理 Python unittest 模块的基础用法。"
publishDate: "2024-07-01T17:16:10+08:00"
categories:
  - "Testing"
tags:
  - "Python"
draft: false
---

## 前言

单元测试（Unit Testing）是一种软件测试方法，通过对软件中的最小可测试单元（通常是函数、方法或类）进行验证，以确保其按预期工作。

单元测试是软件开发过程中不可或缺的一部分，帮助开发人员发现和修复错误，提高代码质量和可靠性。

## Python常见单元测试框架

1. unittest

unittest 是 Python 内置的单元测试框架，受 JUnit 启发，提供了一个全面的测试框架。

特点：

内置于 Python 标准库，无需额外安装。
提供了丰富的断言方法。
支持测试套件、测试装载器等高级功能。

2. pytest

pytest 是一个功能强大、易于使用的第三方测试框架，支持简单的单元测试到复杂的功能测试。

特点：

易于上手，具有简洁的语法。
支持 fixtures，用于设置测试环境。
可以自动发现测试。
支持参数化测试。
具有丰富的插件生态系统。

本文我们将重点讲解unittest的使用。

## unittest

### 对module的测试

这里我们以一个简单的字符串处理函数为例。

#### 创建测试用例

首先，我们定义一个函数，这个函数将字符串中的每个单词的首字母都转换为大写。

```python
# string_utils.py

def capitalize_words(s):
    """
    将字符串中的每个单词的首字母都转换为大写。
    :param s: 输入的字符串
    :return: 首字母大写的字符串
    """
    return ' '.join(word.capitalize() for word in s.split())
```

#### 编写测试方法

接下来，我们编写测试代码来验证这个函数的行为是否符合预期。

```python
# test_string_utils.py
import unittest
from string_utils import capitalize_words

class TestStringUtils(unittest.TestCase):

    def test_capitalize_words(self):
        self.assertEqual(capitalize_words("hello world"), "Hello World")
        self.assertEqual(capitalize_words("python is awesome"), "Python Is Awesome")
        self.assertEqual(capitalize_words("unit testing"), "Unit Testing")
        self.assertEqual(capitalize_words(""), "")  # 测试空字符串
        self.assertEqual(capitalize_words("HELLO WORLD"), "Hello World")  # 测试全大写字符串
        self.assertEqual(capitalize_words("123 abc"), "123 Abc")  # 测试包含数字的字符串

    def test_capitalize_words_with_punctuation(self):
        self.assertEqual(capitalize_words("hello, world!"), "Hello, World!")
        self.assertEqual(capitalize_words("python's unittest"), "Python's Unittest")

if __name__ == '__main__':
    unittest.main()
```

解释
定义函数：

capitalize_words(s) 函数接收一个字符串 s，然后将每个单词的首字母大写后返回。
编写单元测试：

创建一个测试类 TestStringUtils 继承自 unittest.TestCase。
在类中定义多个测试方法来测试 capitalize_words 函数的各种情况。
使用 self.assertEqual 方法来比较函数输出和预期结果。

unittest规定测试方法应该以`test_`开头

运行测试：

if __name__ == '__main__': unittest.main() 允许直接运行测试脚本。

#### 运行测试

你可以在命令行中运行测试脚本，如果所有测试通过，你将看到类似的信息：

```bash
$ python test_string_utils.py
......
----------------------------------------------------------------------
Ran 6 tests in 0.001s

OK

```

### 对类进行测试

假设我们有一个简单的银行账户类 BankAccount，它允许存款、取款和检查余额。我们将编写单元测试来验证这个类的行为是否符合预期。

#### 创建测试用例

首先，定义这个类：

```python
# bank_account.py

class BankAccount:
    def __init__(self, initial_balance=0):
        if initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        self.balance = initial_balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdraw amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

    def get_balance(self):
        return self.balance
```

#### 定义测试方法

接下来，我们编写测试代码来验证这个类的各种行为：

```python
# test_bank_account.py
import unittest
from bank_account import BankAccount

class TestBankAccount(unittest.TestCase):

    def setUp(self):
        """在每个测试方法前运行，初始化一个 BankAccount 实例"""
        self.account = BankAccount(100)

    def test_initial_balance(self):
        self.assertEqual(self.account.get_balance(), 100)

    def test_deposit(self):
        self.account.deposit(50)
        self.assertEqual(self.account.get_balance(), 150)

    def test_withdraw(self):
        self.account.withdraw(30)
        self.assertEqual(self.account.get_balance(), 70)

    def test_withdraw_insufficient_funds(self):
        with self.assertRaises(ValueError) as context:
            self.account.withdraw(200)
        self.assertEqual(str(context.exception), "Insufficient funds")

    def test_negative_initial_balance(self):
        with self.assertRaises(ValueError) as context:
            BankAccount(-100)
        self.assertEqual(str(context.exception), "Initial balance cannot be negative")

    def test_negative_deposit(self):
        with self.assertRaises(ValueError) as context:
            self.account.deposit(-50)
        self.assertEqual(str(context.exception), "Deposit amount must be positive")

    def test_negative_withdraw(self):
        with self.assertRaises(ValueError) as context:
            self.account.withdraw(-50)
        self.assertEqual(str(context.exception), "Withdraw amount must be positive")

if __name__ == '__main__':
    unittest.main()
```

解释
定义类：

BankAccount 类有初始化方法、存款方法、取款方法和获取余额方法。
编写单元测试：

创建一个测试类 TestBankAccount 继承自 unittest.TestCase。
使用 setUp 方法在每个测试方法前初始化一个 BankAccount 实例。
编写多个测试方法来测试 BankAccount 类的各种行为：
test_initial_balance 测试初始化余额。
test_deposit 测试存款操作。
test_withdraw 测试取款操作。
test_withdraw_insufficient_funds 测试余额不足时取款操作是否抛出异常。
test_negative_initial_balance 测试初始化负余额是否抛出异常。
test_negative_deposit 测试存入负金额是否抛出异常。
test_negative_withdraw 测试取出负金额是否抛出异常。

#### 执行测试

if __name__ == '__main__': unittest.main() 允许直接运行测试脚本。

你可以在命令行中运行测试脚本：

```bash
$ python test_bank_account.py
......
----------------------------------------------------------------------
Ran 7 tests in 0.001s

OK
```

...

## 小结

本文我们围绕着unittest的基础功能举例做了说明，在下一篇文章中我们将会用到unittest框架中的一些高级功能来更好的辅助测试开发。
