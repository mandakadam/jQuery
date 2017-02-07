;(function($, window, document, undefined){
	var pluginName = 'mSlide',
	    version = '1',
		count = 0,
		defaults = {pagination:false, controls: true, height:300, autoplay: false, loop: true}

	function Plugin(element, options){
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._init();
	}

	Plugin.prototype = {
		_init: function(){
			var el = this.element;
			
			$(el).height(this.options.height);

			if(this.options.controls)
				this._slideControl(el);

			if(this.options.pagination)
				this._slidePagination(el);

			this._controlClick();
		},
		_slideControl: function(el){
			var slideControl = '',
				disableClass = (this.options.loop ? '' : 'disable');

			slideControl += '<div class="mSlide-control">';
			slideControl += '<a class="mPrev '+disableClass+'" href="javascript:void(0)"> &laquo; </a>';
			slideControl += '<a class="mNext" href="javascript:void(0)"> &raquo; </a>';
			slideControl += '</div>';
			$(el).append(slideControl);
		},
		_slidePagination: function(el){
			var slidePagination = '',
				activeClass = '';

			slidePagination += '<div class="mSlide-pagination">';
			$('li', el).each(function(index){
				activeClass = (index == 0 ? 'active' : '');
				slidePagination += '<a href="javascript:void(0);" class="'+activeClass+' slide_'+ index + '">' + (index+1) + '</span>';
			});	
			slidePagination += '</div>';
			$(el).append(slidePagination);
		},
		_slideCounter: 	function(set,index){
			var el = this.element,
				$ul = $('ul', el),
				$li = $('li', el),
				$prev = $('.mPrev', el),
				$next = $('.mNext', el);
				$liCount = $li.length-1;
		
			switch(set){
				case 'next' :							
					var tempCount = (this.options.loop) ?  0 : count;
					(count < ($li.length-1)) ? count++ : count=tempCount;
					break;

				case 'prev' :
					var tempCount2 = (this.options.loop) ?   $liCount : count;
					(count > 0 && set == 'prev') ? count-- : count=tempCount2;
					break;

				case 'pagination' :
					count=index
					break;

				default:
					count = 0;
					break;
			}
	
			if(!this.options.loop || !this.options.autoplay){
				if(count == $liCount){
					$next.addClass('disable');
					$prev.removeClass('disable');
				}
				else if(count == 0){
					$prev.addClass('disable');
					$next.removeClass('disable');
				}
			}

			$('.mSlide-pagination .active').removeClass('active');
			$('.slide_'+count, el).addClass('active');
			$ul.stop().animate({left:-count*$ul.width()});
		},
		_controlClick: function(){
			var $self = this,
				el = this.element;
			
			$('.mNext', el).click(function(){
				$self._slideCounter('next');
			});

			$('.mPrev', el).click(function(){
				$self._slideCounter('prev');
			});

			$('li', el).each(function(index){
				$('.slide_'+index, el).click( function(){
					$self._slideCounter('pagination', index);
				});
			});

			$(document).keydown(function(e){
				if(e.which == 37)
					$self._slideCounter('prev');
				
				else if(e.which == 39)
					$self._slideCounter('next');
			});

			if(this.options.autoplay){
				setInterval(function(){ 
					$('.mNext').trigger('click');
				}, 3000);
			}
		}
	}

	$.fn[pluginName] = function(options){
		return this.each(function(){
			if(!$.data(this, 'plugin_' + pluginName)){
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}

})(jQuery, window, document);
