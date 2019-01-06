//这是jquery的是用方法，所以必须引用jquery.js
$(document).ready(function(){
    // 点击单选按钮后触发，触发一个事件
    $("input[name=cixing]").click(function(){
        var get_value=$(this).val();//获取选中的值
        $(".show_cixing").css("display","none");//先全部隐藏
        $("#b2_"+get_value).css("display","block");//再显示对应的div
    });


});

///////////////////////////////////
var this_pic="";
//触发事件
function changge(pic){
    if(pic!=this_pic){
        this_pic=pic;
        $(".change_pic").fadeOut();//先全部隐藏
        $("."+pic).fadeIn();//再显示对应的div
    }
}
// 监听滚动事件
$(function(){
    $(window).scroll(function(){
    var h=300;//定义距离div顶部多少开始显示
    var h1=400;//定义距离div顶部多少开始消失
    var mark=false;
    //高度在范围内触发
    for (let index = 1; index < 10; index++) {
        if($(this).scrollTop()>$("#b3_"+index).offset().top-h && $(this).scrollTop() < $("#b3_"+index).offset().top+h1){
            mark=true;
            changge("p"+index);
            break;
        } 
    }
    if(!mark){
        this_pic="";
        $(".change_pic").css("display","none");//先全部隐藏
    }

    });
})