/**
 * @Author: Jzy
 * @Date: 2017/12/12
 * @Last Modified by: Jzy
 * @Last Modified time: 2017/12/12
 */
import jQuery from './jquery-1.11.3.min'

export default (function($, win, undefined){
	// 私有方法对象
	var ObjProvite = (function(){
		return {
			_setParams: function(option){ // 设置属性参数
				this.outerWrapper = option.outerWrapper || this.outerWrapper || null;
                this.targetWrapper = option.targetWrapper || this.targetWrapper || null;
                this.moveItemClass = option.moveItemClass || this.moveItemClass || '';
                this.callback = option.callback || this.callback || null;
			}
		};
	})();
	
	// 1. 构造函数
	var Obj = function(option){
		if (this instanceof Obj){ // 真  ->  说明在外边是这样调的 new JK()
			ObjProvite._setParams.call(this, option);
		} else { // 说明在外边是这样调的  JK()
			return new Obj(option);
		}
	};
	
	// 2. 原型对象  -> 方法
	Obj.prototype = {
		construtor: Obj, // 修改构造函数的指针
		version: '1.0.0', // 组件的版本
		author: 'JZY', // 作者的名称
		install: function(){ // 组件的入口
			if (!this.outerWrapper){
				return console.error('参数有误~~~');
			}
            this.$$outerWrapper = $(this.outerWrapper);
            this.$$tarWrapper = $(this.targetWrapper);
            this.liList = this.$$tarWrapper.get(0).getElementsByTagName('li');
            this.refHeight = this.getRefHeight();
            // 可拖拽节点
            this.$$moveItem = null;
			
			// 事件绑定
			this.bindMoveEvent();
        },
        getRefHeight: function(){
            var len = 30;
            if (this.liList.length > 0){
				len = this.liList[0].offsetHeight / 2;
            }
            return len;
        },
		bindMoveEvent: function(){
			var _this = this;

			this.$$outerWrapper.off('mousedown.jzy').on('mousedown.jzy', 'button', function(ev){
                var $this = $(this);
                
                var _left = $this.offset().left,
                    _top = $this.offset().top,
                    _width = _this.liList.length > 0 ? _this.liList[0].offsetWidth : (_this.$$tarWrapper.width() - 2);
                
				var disX = ev.clientX - _left,
                    disY = ev.clientY - _top;

                setTimeout(function(){
                    // 获取可拖拽控件节点
                    var $$obj = $('.' + _this.moveItemClass);
                    // 克隆节点
                    _this.$$moveItem = $$obj.clone(true);
                    // 添加克隆节点
                    $$obj.after(_this.$$moveItem);
                    
                    _this.$$moveItem.css({
                        width: _width,
                        left: _left,
                        top: _top,
                        opacity: 0
                    });
                    
                    // 创建 I 节点
                    var $$newI = $('<i class="ref-item"></i>');

                    $(document).off('mousemove.jzy').on('mousemove.jzy', function(ev){
                        var l = ev.clientX - disX,
                            t = ev.clientY - disY;
                        
                        _this.$$moveItem.css({
                            left: l,
                            top: t,
                            opacity: Math.abs(t - _top) / 40
                        });
                        
                        var res = _this.checkCollide();

                        if (res.into){
                            if (_this.liList.length == 0){
                                _this.$$tarWrapper.append($$newI);
                            }
                            if (res.index != -1){
                                if (_this.$$tarWrapper.children('i.ref-item').length > 0){
                                    $(_this.liList[res.index])[res.pos]($$newI);
                                } else {
                                    $(_this.liList[res.index])[res.pos == 'after' ? 'before' : 'after']($$newI);
                                }
                            }
                        } else {
                            $$newI.remove();
                        }
                    });

                    $(document).off('mouseup.jzy').on('mouseup.jzy', function(ev){
                        $(this).off('mousemove.jzy');
                        $(this).off('mouseup.jzy');

                        if ($$newI.offset().left || $$newI.offset().top){
                            _this.$$moveItem.animate({
                                left: $$newI.offset().left,
                                top: $$newI.offset().top
                            }, function(){
                                var $this = $(this),
                                    v = $$newI.index();
                                // 不要做 LI DOM 节点移动等操作，会 破坏 vue VNode
                                // $$newI.before(this);
                                // $this.removeAttr('class').removeAttr('style');
                                $this.remove();
                                $$newI.remove();
                                // 回调
                                _this.callback && _this.callback(v);
                            });
                        } else {
                            $$newI.remove();
                            _this.$$moveItem.remove();
                        }
                    });
                    
                }, 0);
				
				return false
			});
		},
		checkCollide: function(){
			var res = {
                into: false,
				index: -1,
				pos: 'before'
			};
            
            // 首先判断是否进入 UL 容器
            if (this.checkColl(this.$$moveItem, this.$$tarWrapper)){
                res.into = !0;
                for (var i = 0, len = this.liList.length; i < len; i++){
                    if (Math.abs(this.$$moveItem.offset().top - $(this.liList[i]).offset().top) < this.refHeight){ // 碰上了
                        if (this.$$moveItem.offset().top < $(this.liList[i]).offset().top){
                            res.pos = 'after';
                        } else {
                            res.pos = 'before';
                        }
                        res.index = i;
                        
                        break;
                    }
                }
            }

			return res;
        },
        checkColl: function($obj1, $obj2){ //检测是否相撞
            var l1 = $obj1.offset().left,
                r1 = l1 + $obj1.outerWidth(),
                t1 = $obj1.offset().top,
                b1 = t1 + $obj1.outerHeight();
                
            var l2 = $obj2.offset().left,
                r2 = l2 + $obj2.outerWidth(),
                t2 = $obj2.offset().top,
                b2 = t2 + $obj2.outerHeight();
    
            if (r1 < l2 || b1 < t2 || l1 > r2 || t1 > b2){ //没有碰上
                return false;
            } else {
                return true;
            }
        },
		update: function(option){ // 更新组件
			ObjProvite._setParams.call(this, option);
		},
		remove: function(){
			
			
			// 释放内存
			for (var i in this){
				this[i] = null;
			}
		}
	};
	
	// 公开接口(构造函数)
	return Obj;
})(jQuery, window);
