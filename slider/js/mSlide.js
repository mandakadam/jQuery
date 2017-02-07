;(function($, window, document, undefined){
	var pluginName = 'mSlide',
	    version = '1',
		count = 0,
		defaults = {pagination:false, controls: true, height:300}

	function Plugin(element, options){
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._init();
	}

	Plugin.prototype = {
		_init: function(){
			var el = this.element;
			
			$(el).height(this.options.height);

			if(this.options.controls){
				this._slideControl(el);
			}

			if(this.options.pagination){
				this._slidePagination(el);
			}
			this._controlClick();
		},
		_slideControl: function(el){
			var slideControl = '';
			slideControl += '<div class="mSlide-control">';
			slideControl += '<a class="mPrev disable" href="javascript:void(0)"> &laquo; </a>';
			slideControl += '<a class="mNext" href="javascript:void(0)"> &raquo; </a>';
			slideControl += '</div>';
			$(el).append(slideControl);
		},
		_slidePagination: function(el){
			var slidePagination = '';
			slidePagination += '<div class="mSlide-pagination">';
			$('li', el).each(function(index){
				var activeClass = (index == 0 ? 'active' : '');
				slidePagination += '<a href="javascript:void(0);" class="'+activeClass+'"  id="slide_'+ index + '">' + (index+1) + '</span>';
			});	
			slidePagination += '</div>';
			$(el).append(slidePagination);
		},
		_slideCounter: 	function(set){
			var el = this.element,
				$ul = $('ul', el),
				$li = $('li', el),
				$prev = $('.mPrev', el),
				$next = $('.mNext', el);

			if(count < ($li.length-1) &&  set == 'next')
				count++;
			else if(count > 0 && set == 'prev')
				count--;
				
			if(count == $li.length-1){
				$next.addClass('disable');
				$prev.removeClass('disable');
			}
			else if(count == 0){
				$prev.addClass('disable');
				$next.removeClass('disable');
			}

			$('.mSlide-pagination .active').removeClass('active');
			$('#slide_'+count).addClass('active');
			$ul.stop().animate({left:-count*$ul.width()});
		},
		_controlClick: function(){
			var $self = this,
				el = this.element;
			
			$(el).on('click','.mNext', function(){
				$self._slideCounter('next');
			});

			$(el).on('click','.mPrev', function(){
				$self._slideCounter('prev');
			});

			$('li', el).each(function(index){
				$(el).on('click', '#slide_'+index, function(){
					count = index;
					$self._slideCounter('pagination');
				});
			});

			$(document).keydown(function(e){
				if(e.which == 37){
					$self._slideCounter('prev');
				}
				else if(e.which == 39){
					$self._slideCounter('next');
				}
			});
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
