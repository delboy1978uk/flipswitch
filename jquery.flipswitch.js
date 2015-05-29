/*
 * jQuery FlipSwitch plugin originally lightswitch by catchmyfame.com
 * @author delboy1978uk@gmail.com
 * @version 1.0
 * @date June 19th 2013
 * @category jQuery plugin
 * @copyright (c) 2013 delboy1978uk@gmail.com
 * @license CC Attribution-Share Alike 3.0 - http://creativecommons.org/licenses/by-sa/3.0/
 */


(function($){
	$.fn.extend({ 
		flipSwitch: function(options)
		{

			//set default options
			var defaults = 
			{
				animSpeed : 120,
				hoverSpeed : 100,
				switchImg : '/js/flipswitch/img/switch.png',
				switchImgCover: '/js/flipswitch/img/switchplate.png',
				switchImgCoverWidth : '63px',
				switchImgCoverHeight : '18px',
				disabledImg : '/js/flipswitch/img/disabled.png',
				onShift : '0px 0px',
				offShift : '-37px 0px',
				peekOff : '-6px 0px',
				peekOn : '-31px 0px'
			};

			//override default options with user set options
			var options = $.extend(defaults, options);
	
    		//do this for each flipswitch
    		return this.each(function() 
    		{

    			var o = options;
				var obj = $(this);

				//if the checkbox is disabled
				if(obj.attr('disabled'))
				{
					//display the disabled switch
					obj.css({'display':'none'}).after('<span><img src="'+o.disabledImg+'" /></span>');
				}
				else
				{	
					//display the switch cover image		
					obj.css({'display':'none'}).after('<span class="switch"><img style="vertical-align: top;" src="'+o.switchImgCover+'" width="'+o.switchImgCoverWidth+'" height="'+o.switchImgCoverHeight+'" /></span>'); //'display':'none'
				}

				// add the actual switch as the background image
				obj.next('span.switch').css({'display':'inline-block','background-image':'url("'+o.switchImg+'")','background-repeat':'no-repeat','overflow':'hidden','cursor':'pointer','margin-right':'2px'});

				
				//do this when the switch gets clicked
				obj.next('span.switch').click(function()
				{
					// If we click radio button, we need to animate the other switches off
					if($(this).prev().is(':radio'))
					{
						radioGroupName = $(this).prev().attr('name');
                        //animate
						$('input[name="'+radioGroupName+'"]'+':checked + span').stop().animate({'backgroundPosition':o.offShift},o.animSpeed);
					}

					// if the switch is on
					if($(this).prev().is(':checked'))
					{
                        // flip it off, set checked = 0
						$(this).stop().animate({'backgroundPosition':o.offShift},o.animSpeed); // off
						//$(this).prev().prop('checked',false);
                        $(this).prev().click();
					}
					else
					{
                        // flip it on, set checked = checked
						$(this).stop().animate({'backgroundPosition':o.onShift},o.animSpeed); // on
						if($(this).prev().is(':radio')) $('input[name="'+radioGroupName+'"]'+':checked').prop('checked',false);
						$(this).prev().click();
					}
				});

				//do this when the mouse hovers over the switch
				obj.next().hover(function()
				{
					//peek on or peek off?
					var peek = $(this).prev().is(':checked') ? o.peekOff : o.peekOn;
					$(this).stop().animate({'backgroundPosition': peek},o.hoverSpeed);
				}
				,function()
				{
					//shift on or shift off?
					var shift = $(this).prev().is(':checked') ? o.onShift :o.offShift;
					$(this).stop().animate({'backgroundPosition': shift},o.hoverSpeed);
				});

				var shift = obj.is(':checked') ? o.onShift : o.offShift;
				obj.next('span.switch').css({'backgroundPosition' : shift}); // setup default states

				$(document).on('click','input + span', function() { return false; });


				obj.change(function(){
					radioGroupName = obj.attr('name');
					if(obj.is(':radio'))
					{
						obj.stop().animate({'backgroundPosition':o.onShift},o.animSpeed);
						$('input[name="'+radioGroupName+'"]'+' + span').stop().animate({'backgroundPosition':o.offShift},o.animSpeed);
					}
					var shift =  obj.is(':checked') ? o.onShift :o.offShift;
					obj.next('span').stop().animate({'backgroundPosition':shift},o.animSpeed);
				});
  			});
    	}
	});
})(jQuery);



/*
 http://keith-wood.name/backgroundPos.html
 Background position animation for jQuery v1.1.1.
 Written by Keith Wood (kbwood{at}iinet.com.au) November 2010.
 Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
 Please attribute the author if you use it.
*/

(function($) { // Hide scope, no $ conflict

    var usesTween = !!$.Tween;

    if (usesTween) { // jQuery 1.8+
        $.Tween.propHooks['backgroundPosition'] = {
            get: function(tween) {
                return parseBackgroundPosition($(tween.elem).css(tween.prop));
            },
            set: setBackgroundPosition
        };
    }
    else { // jQuery 1.7-
        // Enable animation for the background-position attribute
        $.fx.step['backgroundPosition'] = setBackgroundPosition;
    };

    /* Parse a background-position definition: horizontal [vertical]
     @param  value  (string) the definition
     @return  ([2][string, number, string]) the extracted values - relative marker, amount, units */
    function parseBackgroundPosition(value) {
        var bgPos = (value || '').split(/ /);
        var presets = {center: '50%', left: '0%', right: '100%', top: '0%', bottom: '100%'};
        var decodePos = function(index) {
            var pos = (presets[bgPos[index]] || bgPos[index] || '50%').
                match(/^([+-]=)?([+-]?\d+(\.\d*)?)(.*)$/);
            bgPos[index] = [pos[1], parseFloat(pos[2]), pos[4] || 'px'];
        };
        if (bgPos.length == 1 && $.inArray(bgPos[0], ['top', 'bottom']) > -1) {
            bgPos[1] = bgPos[0];
            bgPos[0] = '50%';
        }
        decodePos(0);
        decodePos(1);
        return bgPos;
    }

    /* Set the value for a step in the animation.
     @param  tween  (object) the animation properties */
    function setBackgroundPosition(tween) {
        if (!tween.set) {
            initBackgroundPosition(tween);
        }
        $(tween.elem).css('background-position',
            ((tween.pos * (tween.end[0][1] - tween.start[0][1]) + tween.start[0][1]) + tween.end[0][2]) + ' ' +
                ((tween.pos * (tween.end[1][1] - tween.start[1][1]) + tween.start[1][1]) + tween.end[1][2]));
    }

    /* Initialise the animation.
     @param  tween  (object) the animation properties */
    function initBackgroundPosition(tween) {
        tween.start = parseBackgroundPosition($(tween.elem).css('backgroundPosition'));
        tween.end = parseBackgroundPosition(tween.end);
        for (var i = 0; i < tween.end.length; i++) {
            if (tween.end[i][0]) { // Relative position
                tween.end[i][1] = tween.start[i][1] + (tween.end[i][0] == '-=' ? -1 : +1) * tween.end[i][1];
            }
        }
        tween.set = true;
    }

})(jQuery);
