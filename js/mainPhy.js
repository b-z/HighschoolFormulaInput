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
  {s:'分数线',d:'frac',t:'method'},
  {s:'上标',d:'^',t:'method'},
  {s:'下标',d:'_',t:'method'},
  {s:'根号',d:'sqrt',t:'method'},
  {s:'α',d:'\\alpha',t:'word'},
  {s:'β',d:'\\beta',t:'word'},
  {s:'γ',d:'\\gamma',t:'word'}
];

function addButtons(){
  $('.formulaButton').remove();
  for (i in buttons){
    $('#buttons').append('<button class="formulaButton" onclick="clickButton('+i+');">'+buttons[i].s+'</button>');
  }
}

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
  $('#mathRender')[0].innerHTML=$('#textOut').val();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"mathRender"]);
}
