$( document ).ready(function() {
	$("#content ul li").each(
		function(){
			$(this).hover(
				function(){
					$(this).css('border-left-width','21px');
					$(this).css('padding-left','33px');
					$(this).css('border-left-color','rgb(242,242,242)');
					$(this).css('border-top-color','#EBEBEB');
					$(this).css('border-bottom-color','#EBEBEB');
					$(this).css('border-right-color','#EBEBEB');
					$(this).css('margin-left','-1px');
				},
				function(){
					$(this).css('border-left-width','3px');
					$(this).css('padding-left','50px');
					$(this).css('border-left-color','transparent');
					$(this).css('border-top-color','transparent');
					$(this).css('border-bottom-color','transparent');
					$(this).css('border-right-color','transparent');
					$(this).css('margin-left','0px');
				}
			);
		}
	);
});
