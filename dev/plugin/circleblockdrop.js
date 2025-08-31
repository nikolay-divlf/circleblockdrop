/**!
 * circleblockdrop v2.0 | divleaf.ru | https://github.com/nikolay-divlf/circleblockdrop
 * @author Goryachev Nikolay
 * @copyright NG 29-08-2025
 * @license MIT
 */
(function ($) {
    var name_plugin = 'circleblockdrop';
    var base = {
        data: {version: '2.0', author: 'divleaf.ru', easing: {}},
        counter: 0,
        history: {},
        easing: {
            'EaseOutQuad': function (e, f, a, h, g) {return -h * (f /= g) * (f - 2) + a},
            'EaseInOutQuad': function (e, f, a, h, g) {
                if ((f /= g / 2) < 1) {return h / 2 * f * f + a}
                return -h / 2 * ((--f) * (f - 2) - 1) + a
            },
            'EaseOutCubic': function (e, f, a, h, g) {return h * ((f = f / g - 1) * f * f + 1) + a},
            'EaseInOutQuart': function (e, f, a, h, g) {
                if ((f /= g / 2) < 1) {return h / 2 * f * f * f * f + a}
                return -h / 2 * ((f -= 2) * f * f * f - 2) + a
            },
            'EaseOutQuint': function (e, f, a, h, g) {return h * ((f = f / g - 1) * f * f * f * f + 1) + a},
            'EaseOutSine': function (e, f, a, h, g) {return h * Math.sin(f / g * (Math.PI / 2)) + a},
            'EaseOutBounce': function (e, f, a, h, g) {
                if ((f /= g) < (1 / 2.75)) {
                    return h * (7.5625 * f * f) + a
                } else {
                    if (f < (2 / 2.75)) {
                        return h * (7.5625 * (f -= (1.5 / 2.75)) * f + 0.75) + a
                    } else {
                        if (f < (2.5 / 2.75)) {
                            return h * (7.5625 * (f -= (2.25 / 2.75)) * f + 0.9375) + a
                        } else {
                            return h * (7.5625 * (f -= (2.625 / 2.75)) * f + 0.984375) + a
                        }
                    }
                }
            },
            'EaseInCirc': function (e, f, a, h, g) {return -h * (Math.sqrt(1 - (f /= g) * f) - 1) + a},
            'EaseOutCirc': function (e, f, a, h, g) {return h * Math.sqrt(1 - (f = f / g - 1) * f) + a},
            'EaseInOutCirc': function (e, f, a, h, g) {
                if ((f /= g / 2) < 1) {return -h / 2 * (Math.sqrt(1 - f * f) - 1) + a}
                return h / 2 * (Math.sqrt(1 - (f -= 2) * f) + 1) + a
            },
        },
        events: {
            trigger: {
                init: name_plugin + '-init',
                init_turnoff: name_plugin + '-turnoff',
                add: name_plugin + '-add',
                create: name_plugin + '-create',
                resize: name_plugin + '-resize',
                click: name_plugin + '-click',
                click_end: name_plugin + '-click-end',
                animate_complete: name_plugin + '-animate-complete',
                animate_step: name_plugin + '-animate-step',
                update_options: name_plugin + '-update-options',
                turnoff: name_plugin + '-turnoff',
            },
            on: {
                update_options: name_plugin + '-update-options',
                turnoff: name_plugin + '-turnoff',
            },
        },
        triggerInit: function (self, data) {
            this.trigger(base.events.trigger.init, self, data)
        },
        triggerInitTurnoff: function (self, data) {
            this.trigger(base.events.trigger.init_turnoff, self, data)
        },
        triggerAdd: function (self, data) {
            this.trigger(this.events.trigger.add, self, data)
        },
        triggerResize: function (self, data) {
            this.trigger(this.events.trigger.resize, self, data)
        },
        triggerClick: function (self, data) {
            this.trigger(this.events.trigger.click, self, data)
        },
        triggerClickEnd: function (self, data) {
            this.trigger(this.events.trigger.click_end, self, data)
        },
        triggerCreate: function (self, data) {
            this.trigger(this.events.trigger.create, self, data)
        },
        triggerAnimateComplete: function (self, data) {
            this.trigger(this.events.trigger.animate_complete, self, data)
        },
        triggerAnimateStep: function (self, data) {
            this.trigger(this.events.trigger.animate_step, self, data)
        },
        trigger: function (event, self, data) {
            if (data.run) {
                data.default_options = this.getDefaultOptions();
                delete data.run;
            }
            $(self).trigger(event, (data == undefined ? {} : data));
        },
        getDefaultOptions: function () {
            return {
                resize: false, // изменять положение созданного элемента при изменении экрана
                speed: 300, // скорость элемента
                speed_delay: 0, // начальная задержка элемента
                stack: true, // не удалять предыдущие элементы
                align: 'none', // center, left, top, bottom, right, centerLeft, centerRight, centerTop, centerBottom
                class: name_plugin + '-block', // класс блока
                turnoff: false, // Отключать работу плагина для элемента
                elem: undefined, // текущий созданный элемент
                elem_count: 0, // текущее количество созданных элементов
                elem_begin_width: 0.5, // начальный размер созданного элемента
                elem_begin_height: 0.5, // начальный размер созданного элемента
                elem_name_tag: 'span', // тег созданного элемента
                elem_id: name_plugin + '-elem', // ид созданного элемента
                elem_class: name_plugin + '-elem', // класс созданного элемента
                elem_in_html: '', // html выводимый внутри созданного элемента
                list_elem: [], // временный список элементов которые создались
                animate: {
                    easing: 'swing', // https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js, https://plugins.compzets.com/animatescroll/
                },
                style: {
                    css: { // стили блока в котором создаются элементы
                        'position': 'relative',
                        'overflow': 'hidden',
                        'z-index': '1',
                        'display': 'block',
                    },
                    elem_css: { // стили созданного элемента
                        'position': 'absolute',
                        'background': 'rgba(255, 255, 255, 0.50)',
                        'box-shadow': '0 0 30px rgba(255, 255, 255, 0.50)',
                        'border-radius': '100%',
                        'z-index': '-1',
                        'pointer-events': 'none',
                        'opacity': '0',
                        '-webkit-transition': 'background 0.3s',
                        '-moz-transition': 'background 0.3s',
                        '-o-transition': 'background 0.3s',
                        'transition': 'background 0.3s',
                    },
                },
            };
        },
        _name_selector: undefined,
        _history_selectors: {},
    };
    $.each(base.easing, function (key, callback) {
        base.data.easing[name_plugin + key] = callback;
    });
    jQuery.extend(jQuery.easing, base.data.easing);
    jQuery.circleblockdrop_data = base.data;
    jQuery.circleblockdrop = function (name_selector, options) {
        if (!base._history_selectors[name_selector]) {
            base._name_selector = name_selector;
            jQuery.fn.circleblockdrop(options);
            base._name_selector = undefined;
            base._history_selectors[name_selector] = options;
        }
    };
    jQuery.fn.circleblockdrop = function (options) {
        options = typeof options == 'object' ? options : {};
        var name_selector = base._name_selector;
        var run = {
            addElem: function (self) {
                if ($(self).length) {
                    var options = this.getOptions(self);
                    if (options) {
                        if (options.stack == false && options.elem != undefined) {
                            options.elem.remove();
                        }
                        this.createElem(self, options).animationElem(self, options);
                        base.triggerAdd(self, {run: run, options: this.getOptions(self)});
                    }
                }
                return this;
            },
            createElem: function (self, options) {
                var id_elem = options.elem_id + '_' + options.elem_count;
                var class_elem = '';
                var position = this.positionElem(self, options);
                options.elem_count += 1;
                if (options.elem_class != undefined) {
                    class_elem = options.elem_class;
                }
                $(self).prepend([
                    '<' + options.elem_name_tag + ' id="' + id_elem + '" class="' + class_elem + '">',
                    options.elem_in_html,
                    '</' + options.elem_name_tag + '>'
                ].join(''));
                var elem = $(self).find('#' + id_elem).css(options.style.elem_css).css({
                    'height': options.elem_begin_height + 'em',
                    'width': options.elem_begin_width + 'em',
                    'top': position.top,
                    'left': position.left,
                });
                options.elem = elem;
                options.list_elem[options.elem_count - 1] = {
                    elem: elem,
                    cord: options.cord,
                    left_elem: options.cord.left_elem,
                    top_elem: options.cord.top_elem,
                };
                this.saveOptions(self, options);
                $(self).addClass(options.class);
                base.triggerCreate(self, {run: run, options: options});
                return this;
            },
            animationElem: function (self, options) {
                var elem = options.elem;
                var elem_width_scale = 1;
                var elem_count = options.elem_count - 1;
                elem.css({'opacity': '1'}).animate({'opacity': '0'}, options.speed_delay, function () {
                    elem.animate({now: '+=' + 0.1}, {
                        duration: options.speed,
                        easing: options.animate.easing,
                        step: function (now, fx) {
                            var scale_width = (options.cord.width > options.cord.height ? options.cord.width : (
                                options.cord.width < options.cord.height ? options.cord.height : options.cord.width
                            )) * 3;
                            elem_width_scale = elem_width_scale += (scale_width * scale_width) / 100 * now;
                            var scale = Math.pow(elem_width_scale, 0.5);
                            var opacity = (1 - (now / 0.1));
                            $(this).css({'transform': 'scale(' + scale + ')', 'opacity': opacity});
                            base.triggerAnimateStep(self, {
                                run: run,
                                options: options,
                                now: now,
                                fx: fx,
                                scale: scale,
                                opacity: opacity,
                                cord: options.cord,
                            });
                        },
                        complete: function () {
                            $(this).remove();
                            options.list_elem[elem_count] = undefined;
                            delete options.list_elem[elem_count];
                            if (options.list_elem.length == 0) {
                                $(self).removeClass(options.class);
                                options.elem_count = 0;
                                options.list_elem = [];
                            }
                            base.triggerAnimateComplete(self, {run: run, options: options});
                        }
                    });
                });
                this.saveOptions(self, options);
                return this;
            },
            positionElem: function (self, options) {
                var top_elem = options.cord.top_elem;
                var left_elem = options.cord.left_elem;
                var aligns = options.align.toString().split(',');
                var center_align = false;
                aligns.forEach(function (elem) {
                    center_align = elem.trim() == 'center' ? true : center_align;
                });
                aligns.forEach(function (elem) {
                    elem = elem.trim();
                    if (center_align) {
                        top_elem = options.cord.height / 2;
                        left_elem = options.cord.width / 2;
                        return false;
                    } else if (elem == 'left') {
                        left_elem = 0;
                    } else if (elem == 'right') {
                        left_elem = options.cord.width;
                    } else if (elem == 'top') {
                        top_elem = 0;
                    } else if (elem == 'bottom') {
                        top_elem = options.cord.height;
                    } else if (elem == 'centerLeft' || elem == 'centerRight') {
                        left_elem = options.cord.width / 2;
                    } else if (elem == 'centerTop' || elem == 'centerBottom') {
                        left_elem = options.cord.height / 2;
                    } else if (elem == 'none') {
                        top_elem = options.cord.top_elem;
                        left_elem = options.cord.left_elem;
                        return false;
                    }
                });
                return {left: left_elem, top: top_elem}
            },
            resize: function (self) {
                if ($(self).length) {
                    var options = this.getOptions(self);
                    if (options && $(self).length) {
                        options.list_elem.forEach(function (value) {
                            if (value != undefined) {
                                var elem = value.elem;
                                var cord = value.cord;
                                var width = $(self).outerWidth(true);
                                var height = $(self).outerHeight(true);
                                var left = parseInt(elem.css('left'));
                                var top = parseInt(elem.css('top'));
                                if (width != cord.width && width < cord.width) {
                                    if (width > cord.width) {
                                        left = value.left_elem + ((width - cord.width));
                                    } else if (width < cord.width) {
                                        left = value.left_elem - ((cord.width - width));
                                    }
                                }
                                if (height != cord.height) {
                                    if (height > cord.height) {
                                        top = value.top_elem + ((height - cord.height) / 2);
                                    } else if (height < cord.height) {
                                        top = value.top_elem - ((cord.height - height) / 2);
                                    }
                                }
                                elem.css({'left': left, 'top': top});
                            }
                        });
                    }
                }
                return this;
            },
            addStack: function (self, event) {
                if ($(self).length) {
                    var options = this.getOptions(self);
                    if (options) {
                        this.saveOptions(self, {
                            event: event,
                            cord: {
                                left: event.pageX,
                                top: event.pageY,
                                width: $(self).outerWidth(true),
                                height: $(self).outerHeight(true),
                                offset_left: $(self).offset().left,
                                offset_top: $(self).offset().top,
                                left_elem: event.pageX - $(self).offset().left - (options.elem_begin_width / 2),
                                top_elem: event.pageY - $(self).offset().top - (options.elem_begin_height / 2),
                            },
                        });
                        $(self).css(options.style.css);
                        this.addElem(self);
                    }
                }
                return this;
            },
            getOptions: function (self, get_key) {
                var result = false, key = 0;
                if ($(self).length) {
                    for (var index in base.history) {
                        var value = base.history[index];
                        result = value['elem'] == $(self)[0] ? (function () {
                            key = index;
                            return value['options'];
                        })() : result;
                    }
                    result = get_key && result ? {key: key, options: result} : result;
                }
                return result;
            },
            initOptions: function (self) {
                if ($(self).length) {
                    var data_options = this.getOptions(self);
                    if (!data_options) {
                        this.saveOptions(self, $.extend(true, Object.assign({}, base.getDefaultOptions()), options));
                        return true;
                    }
                }
                return false;
            },
            saveOptions: function (self, options) {
                if ($(self).length) {
                    var data_options = this.getOptions(self, true);
                    if (data_options) {
                        base.history[data_options.key].options = $.extend(true, data_options.options, options);
                    } else {
                        base.history[base.counter] = {elem: self, options: options};
                        base.counter++;
                    }
                }
                return this;
            },
        };

        function initEventsTime(self) {
            base.triggerInit(self, {run: run, options: run.getOptions(self)});
        }

        function initEvents(self) {
            $(self).on(base.events.on.update_options, function (event, options) {
                run.saveOptions(self, options);
            });
            $(self).on(base.events.on.turnoff, function (event, active) {
                active = (typeof active != 'boolean' ? false : active);
                var options = run.getOptions(self);
                if (options) {
                    if (active) {
                        $(self).removeClass(options.class);
                        $.each(options.style.css, function (key) {
                            $(self).css(key, '');
                        });
                    }
                    run.saveOptions(self, {turnoff: active});
                }
            });
        }

        if (name_selector) {
            $(name_selector).map(function () {
                var self = this;
                if (run.initOptions(self)) {
                    setTimeout(function () {
                        $(window).on('resize', function () {
                            var options = run.getOptions(self);
                            if ($(self).length && options.resize && !options.turnoff) {
                                run.resize(self);
                                base.triggerResize(self, {run: run, options: run.getOptions(self)});
                            }
                        });
                        initEventsTime(self);
                    }, 1);
                    initEvents(self);
                } else {
                    var data_options = run.getOptions(self);
                    data_options.turnoff = false;
                    run.saveOptions(self, $.extend(true, data_options, options));
                    base.triggerInitTurnoff(self, {run: run, options: run.getOptions(self)});
                }
            });
            $('body').on('click', name_selector, function (event) {
                var self = this;
                if (run.initOptions(self)) {
                    setTimeout(function () {
                        initEventsTime(self);
                    }, 1);
                    initEvents(self);
                }
                var options = run.getOptions(self);
                if (!options.turnoff) {
                    base.triggerClick(self, {run: run, options: options});
                    setTimeout(function () {
                        run.addStack(self, event);
                        base.triggerClickEnd(self, {run: run, options: options});
                    }, 2);
                }
            });
            return $(name_selector);
        } else {
            $(this).map(function () {
                var self = this;
                if (run.initOptions(self)) {
                    setTimeout(function () {
                        $(window).on('resize', function () {
                            var options = run.getOptions(self);
                            if ($(self).length && options.resize && !options.turnoff) {
                                run.resize(self);
                                base.triggerResize(self, {run: run, options: run.getOptions(self)});
                            }
                        });
                    }, 1);
                    $(this).unbind('click').on('click', function (event) {
                        var self_click = this;
                        run.initOptions(self_click);
                        var options = run.getOptions(self);
                        if (!options.turnoff) {
                            base.triggerClick(self, {run: run, options: options});
                            setTimeout(function () {
                                run.addStack(self_click, event);
                                base.triggerClickEnd(self, {run: run, options: options});
                            }, 2);
                        }
                    });
                    setTimeout(function () {
                        initEventsTime(self);
                    }, 1);
                    initEvents(self);
                } else {
                    var data_options = run.getOptions(self);
                    data_options.turnoff = false;
                    run.saveOptions(self, $.extend(true, data_options, options));
                    base.triggerInitTurnoff(self, {run: run, options: run.getOptions(self)});
                }
            });
            return $(this);
        }
    };
})(jQuery);