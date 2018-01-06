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
			this.liList = this.$$outerWrapper.get(0).getElementsByTagName('li');
			this.refHeight = this.getRefHeight();

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

			this.$$outerWrapper.off('mousedown.jzy').on('mousedown.jzy', 'li', function(ev){
				if (ev.target.nodeName != 'LI'){
					return false
				}
				var $this = $(this);

				if ($this.hasClass('active')){
					return false
				}

				var isMoved = !1,
					curIndex = $this.index(),
					disX = ev.clientX - this.offsetLeft,
					disY = ev.clientY - this.offsetTop;

				// 获取当前拖拽节点的位置
				$this.css({
					width: $this.width(),
					left: this.offsetLeft,
					top: this.offsetTop,
					zIndex: 9
				}).addClass('move');
				
				// 创建 I 节点
				var $$newI = $('<i class="ref-item"></i>');
				$this.before($$newI);

				$(document).off('mousemove.jzy').on('mousemove.jzy', function(ev){
					isMoved = !0;
					
					var l = ev.clientX - disX,
						t = ev.clientY - disY;

					$this.css({
						left: l,
						top: t
					});

					var res = _this.checkCollide($this);
					
					// 移动 I 节点
					if (res.index != -1){
						$(_this.liList[res.index])[res.pos]($$newI);
					}
				});

				$(document).off('mouseup.jzy').on('mouseup.jzy', function(ev){
					$(this).off('mousemove.jzy');
					$(this).off('mouseup.jzy');

					if (isMoved){
						$this.animate({
							left: $$newI.get(0).offsetLeft,
							top: $$newI.get(0).offsetTop
						}, function(){
							// 不要做 LI DOM 节点移动等操作，会 破坏 vue VNode
							// $$newI.before($this);
							var v = $$newI.index();
							$this.removeAttr('class').removeAttr('style');
							$$newI.remove();
							_this.callback && _this.callback('move', {
								target: v,
								current: curIndex
							});
						});
					} else { // 点击
						$this.removeAttr('class').removeAttr('style');
						$$newI.remove();
						_this.callback && _this.callback('click', {});
					}
				});
				
				return false
			});
		},
		checkCollide: function($obj){
			var res = {
				index: -1,
				pos: 'before'
			};
			
			for (var i = 0, len = this.liList.length; i < len; i++){
				if (this.liList[i] == $obj.get(0)){
					continue;
				}
				if (Math.abs($obj.get(0).offsetTop - this.liList[i].offsetTop) < this.refHeight){ // 碰上了
					if ($obj.get(0).offsetTop < this.liList[i].offsetTop){
						res.pos = 'after';
					} else {
						res.pos = 'before';
					}
					res.index = i;
					
					break;
				}
			}

			return res;
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
