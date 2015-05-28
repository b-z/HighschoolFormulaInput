/*
整体结构:
公式按下面的形式(式1)存储
    ['1','2','3',{n:'sqrt',u1:[{n:'frac',u1:['1'],u2:['2','a','\gamma','\Gamma']},'\Theta']}]
按下面的形式(式2)呈现
    1 2 3 \sqrt{ \frac{ 1 }{ 2 a \gamma \Gamma } \Theta }
然后渲染一下就好了

要解决的问题:
    如何移动光标位置
        光标位置的存储方法:
            使用一个整数pos。
            这个数表示光标位于 式2 中第几个空格的位置(从0开始)
        elementSize()函数:
            返回一个东西中的空格数，比如:
                对于一个字符，就返回1(可以插在后面)，
                空数组返回1
                对于sqrt对象，返回其内部所有elementSize的和，最后再加一
                对于数组[{n:sqrt,u1:[]}]，中间的对象是2，数组首部有个1
        左右移动光标就是pos加加减减
    添加元素
        addElementToObject(obj, p, elem):
            注意: p<=size(obj)-1
            先求u1的size，
            如果p<size(u1)，obj.u1=addElementToArray(obj.u1, p, elem)
            否则，obj.u2=addElementToArray(obj.u2, p-size(u1), elem)
            返回obj
        addElementToArray(arr, p, elem):
            如果p=0, 就把elem插在最前面并返回
            如果p<elementSize(arr[0]), 则将arr[0]替换成addElementToObject(arr[0], p-1, elem)
            否则(即p>=size(arr0)), arr1=arr[1~n], addElementToArray(arr1,p-elementSize(arr[0]),elem), arr=arr[0]&arr1
    删除元素的方法

*/
var pos=0;
var square_count=0;
/*新方法*/
var test=['1','2','3',{n:'\\sqrt',u1:[{n:'\\frac',u1:['1'],u2:['2','a','\\gamma','\\Gamma']},'\\Theta']}];

function deepcopy(t){
    if (t==undefined)
        return t;
    if (typeof(t)==='string')
        return t;
    if (t.n!=undefined)
        return {n:t.n, u1:deepcopy(t.u1), u2:deepcopy(t.u2)};
    var res=[];
    for (var i in t){
        res.push(deepcopy(t[i]));
    }
    return res;
}

function addCursor(t){
    var tmp=deepcopy(t);
    tmp=addElementToArray(tmp,pos,'□');
    //console.log(tmp);
    return tmp;
}

function convert(arr){
    //转换成tex表达式
    if (arr===undefined)
        return '';
    var res='';
    for (var i in arr){
        res+=convertObj(arr[i]);
    }
    return '{'+res+'}'
}

function convertObj(obj){
    //把一个对象转换成tex表达式
    if (typeof(obj)==='string'){
        return obj+' ';
    }else{
        return obj.n+' '+convert(obj.u1)+convert(obj.u2);
    }
}

function objectSize(x){
    var ret;
    try{
        ret=arraySize(x.u1)+arraySize(x.u2)+1;
        return ret;
    }
    catch(e){
        console.log('error');
    }
}

function arraySize(x){
    if (x===undefined)
        return 0;
    var res=1;
    for (var i in x)
        res+=objectSize(x[i]);
    return res;
}

function addElementToObject(obj, p, elem){
//    console.log(obj);
    var s=arraySize(obj.u1);
    if (p<s){
        obj.u1=addElementToArray(obj.u1, p, elem);
    } else {
        obj.u2=addElementToArray(obj.u2, p-s, elem);
    }
    return obj;
}

function addElementToArray(arr, p, elem){
//    console.log(arr);
    if (p==0){
        return [elem].concat(arr);
    }else if (p<objectSize(arr[0])){
        arr[0]=addElementToObject(arr[0], p-1, elem);
        return arr;
    }else{
        var arr0=[arr[0]];
        return arr0.concat(addElementToArray(arr.splice(1),p-objectSize(arr0[0]),elem));
    }
}

function deleteElement(arr, pos){

}

/**/

var buttons=[
  {s:'分数线',d:'frac',t:'method'},
  {s:'上标',d:'^',t:'method'},
  {s:'下标',d:'_',t:'method'},
  {s:'根号',d:'sqrt',t:'method'},
  {s:'Π',d:'pi',t:'method'},
  {s:'Σ',d:'sigma',t:'method'},

  {s:'α',d:'\\alpha',t:'word'},
  {s:'β',d:'\\beta',t:'word'},
  {s:'γ',d:'\\gamma',t:'word'},
  {s:'δ',d:'\\delta',t:'word'},
  {s:'π',d:'\\pi',t:'word'},

  {s:'<',d:'left',t:'method'},
  {s:'>',d:'right',t:'method'}
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
        test=addElementToArray(test,pos,{n:'\\frac',u1:[],u2:[]});
        pos++;
    }else if (d=='^'){
        test=addElementToArray(test,pos,{n:'^',u1:[]});
        pos++;
    }else if (d=='_'){
        test=addElementToArray(test,pos,{n:'_',u1:[]});
        pos++;
    }else if (d=='sqrt'){
        test=addElementToArray(test,pos,{n:'\\sqrt',u1:[]});
        pos++;
    }else if (d=='pi'){
        test=addElementToArray(test,pos,'\\prod^{');
        pos++;
        test=addElementToArray(test,pos,'}_{');
        pos++;
        test=addElementToArray(test,pos,'}');
        pos--;
    }else if (d=='sigma'){
        test=addElementToArray(test,pos,'\\sum^{');
        pos++;
        test=addElementToArray(test,pos,'}_{');
        pos++;
        test=addElementToArray(test,pos,'}');
        pos--;
    }else if (d=='left'){
        pos--;
    }else if (d=='right'){
        pos++;
    }
  $('#textOut').val(str);
}

function typeIn(d){
    test=addElementToArray(test,pos,d);
    pos++;
}

var strpre='';

document.addEventListener('keyup',function(e){
  console.log(e.which);
  if (e.which>=65&&e.which<=90){
    typeIn(e.shiftKey?String.fromCharCode(e.which).toUpperCase():String.fromCharCode(e.which).toLowerCase());
  }
  if (e.which>=48&&e.which<=57){
    typeIn(e.shiftKey?([')','!','@','\\#','\\$','\\%','^','\\&','*','('][e.which-48]):(e.which-48+''));
  }
  switch (e.which){
    case 38:case 37:if (pos>0)pos--;break;
    case 40:case 39:if (pos<arraySize(test)-1)pos++;break;
  }
  if (e.shiftKey){
      switch (e.which) {
        case 189:typeIn('_');break;
        case 187:typeIn('+');break;
        case 219:typeIn('\\{');break;
        case 221:typeIn('\\}');break;
        case 220:typeIn('|');break;
        case 186:typeIn(':');break;
        case 222:typeIn('\"');break;
        case 188:typeIn('<');break;
        case 190:typeIn('>');break;
        case 191:typeIn('?');break;
        case 192:typeIn('~');break;
      }
  }
  if (!e.shiftKey){
    switch (e.which) {
        case 189:typeIn('-');break;
        case 187:typeIn('=');break;
        case 219:typeIn('[');break;
        case 221:typeIn(']');break;
        case 186:typeIn(';');break;
        case 222:typeIn('\'');break;
        case 188:typeIn(',');break;
        case 190:typeIn('.');break;
        case 191:typeIn('/');break;
        case 192:typeIn('`');break;
        case 13: typeIn('\\\\');break;
        case 32:typeIn('\\ ');break;
        case 8:deleteElement(test,pos);break;
    }
  }
});

document.addEventListener('mouseup',function(e){
    //console.log(e.target);
});

setInterval(function(){
    str=convert(addCursor(test));
	if (strpre!=str){
		render();
	}
	strpre=str;
    $('#textOut').val(str);
    $('#textIn').val(JSON.stringify(test));
    var u=$('[id^=MathJax-Span]');
    for (var i in u) if (u[i].innerHTML=='□') {
      u[i].style.color='blue';
    }

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
