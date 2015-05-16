/*
  实现思路：
  设置一排按钮，点点点点点
*/
/*
var inputStr='';
var inputPre='';
setInterval(function(){
	commit();
	inputStr=$('#textIn').val();
	if (inputPre!=inputStr){
		render();
	}
	inputPre=inputStr;
}, 100);
*/
var buttons=[
  {s:'分数线（上）',d:'frac',t:'method'},
  {s:'分数线（下）',d:'frac2',t:'method'},
  {s:'上标',d:'^',t:'method'},
  {s:'下标',d:'_',t:'method'},
  {s:'根号',d:'sqrt',t:'method'},
  {s:'结束',d:'exit',t:'method'},
  {s:'α',d:'\\alpha',t:'word'},
  {s:'β',d:'\\beta',t:'word'},
  {s:'γ',d:'\\gamma',t:'word'}
];

function addButtons(){
  $('.formulaButton').remove();
  for (i in buttons){
    $('#buttons').append('<button class="formulaButton" style="margin-right:5px;" onclick="clickButton('+i+');">'+buttons[i].s+'</button>');
  }
}
/*注意，退格键要处理一下*/
function clickButton(n){
  var b=buttons[n];
  with (b){
    if (t=='method'){
      execute(d);
    }
    if (t=='word'){
      typeIn(d);
    }
  }
}

function execute(d){
  if (d=='frac'){
    str+='\\frac {';
  }else if (d=='frac2'){
    str+='}{';
  }else if (d=='^'){
    str+='^{';
  }else if (d=='_'){
    str+='_{'
  }else if (d=='sqrt'){
    str+='\\sqrt {'
  }else if (d=='exit'){
    str+='}';
  }
  $('#textOut').val(str);
}

function typeIn(d){
  str+=d;
  $('#textOut').val(str);
}

var str='';
var strpre='';

document.addEventListener('keyup',function(e){
  // console.log(e);
  if (e.which>=65&&e.which<=90){
    str+=String.fromCharCode(e.which).toLowerCase();
    $('#textOut').val(str);
  }
});

setInterval(function(){
	if (strpre!=str){
		render();
	}
	strpre=str;
}, 100);

function commit(){
  var data=$('#textIn').val();
  var out=parseFullStringIntoNoSpecialStrings(data);
  $('#textOut').val(out);
}

function render(){
	$('#mathRender').remove();
	$('.MathJax').remove();
	$('.MathJax_Preview').remove();
  $('body').append('<script type="math/tex" id="mathRender"></script>');
  $('#mathRender')[0].innerHTML=str;
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"mathRender"]);
}

addButtons();
