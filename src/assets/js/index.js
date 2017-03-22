$(document).foundation();
$(document).ready(function(){
	$('code').each(function(i){
		$(this).text($(this).html());
	});
});