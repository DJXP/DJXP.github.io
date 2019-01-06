// JavaScript Document
window.onbeforeunload = function(){
	var radios $('input[name="cixing"]');
}
for(var i=0; i<radios.length;i++){
	radios[i].onclick=function(){
		var cixing = $('input[name="cixing"]:checked').val();
		console.log(cixing);
		if(cixing == a){
			$("#b2_a").css("display","none");
		}else{
			$("#b2_a").css("display","none");
		}
		
	}
}