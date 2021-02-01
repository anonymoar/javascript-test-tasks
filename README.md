# Решения задач

## "Просто прибавь"

Функция, принимающая два аргумента. Первый аргумент - массив, состоящий из цифр от 0 до 9.
Второй - любое целое положительное число. Возвращает массив из цифр от 0 до 9, который
получается путем прибавления второго аргумента к числу, составленного из элементов массива.
Если в массиве есть элементы, не являющиеся числами от 0 до 9, метод возвращает null .

TODO:
1. Добавить примеры ввода/вывода
2. Сделать решение оптимальнее

Запуск:

```javascript
npm run start:task-1
```

## "Форматирование операций"

Функция, принимающая данные в формате JSON и возвращающая отформатированную определенным образом строку.

Запуск:

```javascript
npm run start:task-2
```

## "Параллельные вычисления"

Функция, принимает два аргумента. Первый аргумент - массив синхронных функций,
а второй - функция любого типа. Функция вызывает функции из первого аргумента и затем,
когда они все выполнятся, запускает функцию, переданную вторым аргументом.
В функции из массива передается callback, который вызывается по окончании выполнения.

Запуск:

```javascript
npm run start:task-3
```

## "Создаем базу данных!"

Сформирована маленькая база данных. Поэтапно:

1. Получены 10 пользователей с помощью запросов к https://reqres.in/api/users/{ID юзера}.
   В данном API ID юзеров начинаются с 1.
2. Модифицированы данные так, чтобы у каждого пользователя был свой новый уникальный ID,
   объединены его имя и фамилия.
3. Загружен его аватар, сохранен в директорию и прописан в полученные данные корректный
   локальный адрес.
4. Сохранена сформированная база данных в отдельный файл в формате JSON.

Запуск:

```javascript
npm run start:task-4
```
