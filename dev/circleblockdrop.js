(function($){
    jQuery.fn.circleblockdrop = function(options_base) {
        return $(this).map(function(){

            var options = {};

            function addElem() {
                if (options.stack == false && options.elem != undefined) {
                    options.elem.remove();
                }

                createElem();
                animationElem();
            }

            function createElem() {
                var idElem = options.elemId + '_' + options.elemCount;
                var classElem = '';
                var position = positionElem();

                options.elemCount += 1;

                if (options.elemClass != undefined) {
                    classElem = options.elemClass;
                }

                options.self.prepend([
                    '<' + options.elemNameTag + ' id="' + idElem + '" class="' + classElem + '">',
                        options.elemInHtml,
                    '</' + options.elemNameTag + '>'
                ].join(''));

                var elem = options.self.find('#' + idElem).css(options.elemCss).css({
                    'height' : options.elemBeginHeight,
                    'width' : options.elemBeginWidth,
                    'top': position.top,
                    'left': position.left,
                });


                options.elems[options.elemCount-1] = {
                    elem: elem,
                    coord: options.coord,
                    leftElem: options.coord.leftElem,
                    topElem: options.coord.leftElem,
                };
                
                setOptions({elem: elem});

                options.self.addClass(options.class);
            }

            function animationElem() {
                var elem = options.elem;
                var elemWidthScale = 1;
                var elemCount = options.elemCount - 1;

                elem.css({
                    'opacity' : '1',
                }).animate({'opacity' : '0'}, options.speedDelay, function(){
                    elem.animate({  now: '+=' + 0.1 }, {
                        duration: options.speed,
                        step: function(now, fx) {
                            var scaleWidth = (options.coord.width > options.coord.height ? options.coord.width : (
                                options.coord.width < options.coord.height ? options.coord.height : options.coord.width
                            )) * 3;

                            elemWidthScale = elemWidthScale += (scaleWidth * scaleWidth) / 100 * now;

                            var scale = Math.pow(elemWidthScale, 0.5);
                            
                            $(this).css({
                                'transform':'scale(' + scale + ')', 
                                'opacity' : (1 - (now / 0.1))
                            }); 
                        },
                        complete : function(){
                            $(this).remove();
                            options.elems[elemCount] = undefined;
                            delete options.elems[elemCount];

                            var count = 0;

                            options.elems.forEach(function(){ count += 1; });

                            if (count == 0) {
                                options.self.removeClass(options.class);
                                options.elemCount = 0;
                                options.elems = [];
                            }
                        }
                    });
                });
            }

            function positionElem() {
                var topElem = options.coord.topElem;
                var leftElem = options.coord.leftElem;
                var aligns = options.align.toString().split(',');
                var centerAlign = false;

                aligns.forEach(function(elem) {
                    centerAlign = elem.trim() == 'center' ? true : centerAlign;
                });

                aligns.forEach(function(elem){
                    elem = elem.trim();

                    if (centerAlign) {
                        topElem = options.coord.height / 2;
                        leftElem = options.coord.width / 2;

                        return false;
                    } else if (elem == 'left') {
                        leftElem = 0;
                    } else if (elem == 'right') {
                        leftElem = options.coord.width;
                    } else if(elem == 'top') {
                        topElem = 0;
                    } else if(elem == 'bottom') {
                        topElem = options.coord.height;
                    } else if(elem == 'centerLeft' || elem == 'centerRight') {
                        leftElem = options.coord.width / 2;
                    } else if(elem == 'centerTop' || elem == 'centerBottom') {
                        leftElem = options.coord.height / 2;
                    } else if (elem == 'none') {
                        topElem = options.coord.topElem;
                        leftElem = options.coord.leftElem;

                        return false;
                    }
                });

                return {
                    left: leftElem,
                    top: topElem,
                }
            }

            function resizeElems() {
                options.elems.forEach(function(value){
                    if (value != undefined) {
                        var elem = value.elem;
                        var coord = value.coord;
                        var width = options.self.outerWidth(true);
                        var height = options.self.outerHeight(true);
                        var left = parseInt(elem.css('left'));
                        var top = parseInt(elem.css('top'));

                        if (width != coord.width && width < coord.width) {
                            if (width > coord.width) {
                                left = value.leftElem + ((width - coord.width));
                            } else if (width < coord.width) {
                                left = value.leftElem - ((coord.width - width));
                            }
                        }

                        if (height != coord.height) {
                            if (height > coord.height) {
                                top = value.topElem + ((height - coord.height) / 2);
                            } else if (height < coord.height) {
                                top = value.topElem - ((coord.height - height) / 2);
                            }
                        }

                        elem.css({
                            'left' : left,
                            'top' : top,
                        });
                    }
                });
            }

            function init() {
                options.self.each(function(){
                    if ($(this).attr('data-init-plugin-circleblockdrop') == undefined) {
                        $(this).on('click', function(event) {
                            setOptions({
                                event: event,
                                coord: {
                                    left: event.pageX,
                                    top: event.pageY,
                                    width: options.self.outerWidth(true),
                                    height: options.self.outerHeight(true),
                                    offsetLeft: options.self.offset().left,
                                    offsetTop: options.self.offset().top,
                                    leftElem : event.pageX - options.self.offset().left - (options.elemBeginWidth / 2),
                                    topElem : event.pageY - options.self.offset().top - (options.elemBeginHeight / 2),
                                },
                            });
        
                            options.self.css(options.css);
        
                            addElem();
                        });
                        $(this).attr('data-init-plugin-circleblockdrop', 'true');
                    }
                });
            }

            function setOptions(options_c) {
                options = $.extend(true, options, options_c);
            }

            function getOptions() {
                return options_base;
            }

            return $(this).each(function(){
                setOptions($.extend(true, {
                    version: '1.0.0',
                    self: $(this),
                    resize: false, // изменять положение созданного элемента при изменении экрана
                    resizeFun: undefined, //function
                    updateFun: undefined, //function
                    speed: 600, // скорость элемента
                    speedDelay: 0, // начальная задержка элемента
                    stack: true, //не удалять предыдущие элементы
                    align: 'none', // center, left, top, bottom, right, centerLeft, centerRight, centerTop, centerBottom
                    css: { // стили блока в котором создаются элементы
                        'position' : 'relative',
                        'overflow' : 'hidden',
                        'z-index' : '1',
                        'display' : 'block'
                    },
                    class: 'circleblockdrop_block', // класс блока
                    elem: undefined, // текущий созданный элемент
                    elems: [], // временный список элементов которые создались
                    elemCss: { // стили созданного элемента
                        'position': 'absolute',
                        'background': 'rgba(221, 221, 221, 0.50)',
                        'border-radius': '100%',
                        'z-index': '-1',
                        'pointer-events': 'none',
                        'opacity': '0',
                        '-webkit-transition': 'background 0.3s',
                        '-moz-transition': 'background 0.3s',
                        '-o-transition': 'background 0.3s',
                        'transition': 'background 0.3s',
                    },
                    elemCount: 0, // текущее количество созданных элементов
                    elemBeginWidth: 5, // начальный размер созданного элемента
                    elemBeginHeight: 5, // начальный размер созданного элемента
                    elemNameTag: 'span', // тег созданного элемента
                    elemId: 'circleblockdrop_elem', // ид созданного элемента
                    elemClass: 'circleblockdrop_elem', // класс созданного элемента
                    elemInHtml: '', // html выводимый внутри созданного элемента
                }, getOptions()));


                options.resizeFun = function() {
                    init();

                    return this;
                };

                options.updateFun = function(options_c) {
                    setOptions(options_c);

                    return this;
                };

                if (options.resize) {
                    $(window).resize(function() {
                        resizeElems();
                    });
                }

                init();
            }), options;
        });
    };
})(jQuery);