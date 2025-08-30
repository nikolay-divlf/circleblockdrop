Подробно можно узнать о модуле на сайте: https://divleaf.ru/ru/circleblockdrop

Разработчик плагина Divleaf.ru (Nikolay)

### 1. Выполнить вызов плагина можно несколькими способами

##### - Если вам нужно инициализировать на указанные селекторы, и также инициализировать плагин на кнопку если она будет созданна как новая в документе dom
К примеру если будет созданна новая кнопка на странице, то плагин сразу ее инициализирует и она будет работать.
Этот вариант рекомендуется применять.

Пример 1.
```javascript
    $.circleblockdrop('.button', {
       // options
    });
```
Пример 2.
```javascript
    $.circleblockdrop('.button2, .button', {
       // options
    });
```

##### - Если вы выполняете навигаю по вложенности дом документа
Пример 1.
```javascript
    $('.button1').circleblockdrop({
       // options
    });
```
Пример 2.
```javascript
    $(this).circleblockdrop({
       // options
    });
```

### 2. Опции 
Добавляем что-то внутрь элемента, например картинку или символ:
```javascript
   {
    elem_in_html: ''
   }
```
Начальный размер элемента:
```javascript
   {
     elem_begin_width: 0.5,
     elem_begin_height: 0.5
   }
```
Изменить координаты элемента, если изменился размер кнопки:
```javascript
   {
     resize: true
   }
```
Позиционирование элемента:
```javascript
   {
     align: 'left, top'
   }
```
Удалить предыдущие элементы:
```javascript
   {
     stack: true
   }
```
Начальная задержка элемента:
```javascript
   {
     speed_delay: 30
   }
```
Скорость элемента:
```javascript
   {
     speed: 300
   }
```

### 3. Изменяем стили для кнопки или элемента которое выводится в кнопке

Изменяем стили кнопки:
```json
   {
    style: {
        css: { 
            'position': 'relative', 
            'overflow': 'hidden', 
            'z-index': 1, 
            'display': 'block',
        },
    }
   }
```
Изменяем стили элемента в кнопке:
```json
   {
    style: {
        elem_css: { 
            'position': 'absolute', 
            'background': 'rgba(255, 255, 255, 0.50)', 
            'border-radius': '100%', 
            'z-index': '-1', 
            'pointer-events': 'none', 
            'opacity': '0', 
            '-webkit-transition': 'background 0.3s', 
            '-moz-transition': 'background 0.3s', 
            '-o-transition': 'background 0.3s', 
            'transition': 'background 0.3s', 
        },
    }
   }
```

### 4. Изменяем классы или ид, если у вас есть конфликт с версткой, чтобы ид и классы были разными
Класс для кнопки:
```javascript
   {
    class: 'circleblockdrop-block'
   }
```
Ид для элемента:
```javascript
   {
    elem_id: 'circleblockdrop-elem'
   }
```
Класс для элемента:
```javascript
   {
    elem_class: 'circleblockdrop-elem'
   }
```

### 5. Эффекты замедления для анимации
Правильное применение опции:
```javascript
   {
    animate: {
        easing: 'swing'
    }
   }
```
В значение "easing" доступно следующий список:
- swing
- linear
- circleblockdropEaseOutQuad
- circleblockdropEaseInOutQuad
- circleblockdropEaseOutCubic
- circleblockdropEaseInOutQuart
- circleblockdropEaseOutQuint
- circleblockdropEaseOutSine
- circleblockdropEaseOutBounce
- circleblockdropEaseInCirc
- circleblockdropEaseOutCirc
- circleblockdropEaseInOutCirc

Если вам нужно еще дополнительные события, то вы можете подгрузить файл "jqury", который дополнит список "easing"
- https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js

И также известен список событий, на сайте выполняется демонстрация этих событий:
- https://plugins.compzets.com/animatescroll/

### 6. События при выполнении плагина

- event - возращаются события кнопки
- data - передаются данные кнопки (это могут быть опции которые вы передаете при вызове или данные которые отрабатываются в процессе срабатывания события)

##### - (Событие) Инициализация кнопки
```javascript
   $('.button').on('circleblockdrop-init', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Добавление логики на элемент который еще не создан в кнопке
```javascript
   $('.button').on('circleblockdrop-add', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Создание элемента в кнопке
```javascript
   $('.button').on('circleblockdrop-create', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Если произойдет изменения размера кнопки, при изменении окна браузера, то сработает данное событие
```javascript
   $('.button').on('circleblockdrop-resize', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Выполнили клик на кнопку
```javascript
   $('.button').on('circleblockdrop-click', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Завершился клик на кнопку
```javascript
   $('.button').on('circleblockdrop-click-end', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Выполнение анимации элемента в кнопке
```javascript
   $('.button').on('circleblockdrop-animate-step', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Завершении анимации элемента в кнопке
```javascript
   $('.button').on('circleblockdrop-animate-complete', function (event, data) {
       console.log(data);
   });
```
##### - (Событие) Изменение опций, при выполнении триггера
```javascript
   $('.button').on('circleblockdrop-update-options', function (event, data) {
       console.log(data);
   });
```
##### - (Триггер) Изменяем опции в кнопки
```javascript
   $('.button').trigger('circleblockdrop-update-options', {
       // ...
   });
```
##### - (Триггер) Отключение плагина (Разрушать не получиться, только отключаем)
```javascript
   $('.button').trigger('circleblockdrop-turnoff', true); // Отключить
   // Или 
   $('.button').trigger('circleblockdrop-turnoff', false); // Включить
```

