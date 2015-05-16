var db=[
  {s:'caco3',d:'CaCO_3'},
  {s:'cacl2',d:'CaCl_2'},
  {s:'nh4+',d:'NH_4^+'},
  {s:'h2o',d:'H_2O'},
  {s:'co2',d:'CO_2'},
  {s:'h2',d:'H_2'},
  {s:'g=mg',d:'G=mg'},
  {s:'1/2at2',d:'\\frac{1}{2}at^2'},
  {s:'v2=2ax',d:'v^2=2ax'},
  {s:'shang',d:'\\uparrow'}
];

var chem=[
	{s:'h',d:'H'},
	{s:'he',d:'He'},
	{s:'li',d:'Li'},
	{s:'be',d:'Be'},
	{s:'b',d:'B'},
	{s:'c',d:'C'},
	{s:'n',d:'N'},
	{s:'o',d:'O'},
	{s:'f',d:'F'},
	{s:'ne',d:'Ne'},
	{s:'na',d:'Na'},
	{s:'mg',d:'Mg'},
	{s:'al',d:'Al'},
	{s:'si',d:'Si'},
	{s:'p',d:'P'},
	{s:'s',d:'S'},
	{s:'cl',d:'Cl'},
	{s:'ar',d:'Ar'},
	{s:'k',d:'K'},
	{s:'ca',d:'Ca'},
	{s:'sc',d:'Sc'},
	{s:'ti',d:'Ti'},
	{s:'v',d:'V'},
	{s:'cr',d:'Cr'},
	{s:'mn',d:'Mn'},
	{s:'fe',d:'Fe'},
	//{s:'co',d:'Co'},
	{s:'ni',d:'Ni'},
	{s:'cu',d:'Cu'},
	{s:'zn',d:'Zn'},
	{s:'ga',d:'Ga'},
	{s:'ge',d:'Ge'},
	{s:'as',d:'As'},
	{s:'se',d:'Se'},
	{s:'br',d:'Br'},
	{s:'kr',d:'Kr'},
	{s:'ag',d:'Ag'},
	{s:'cd',d:'Cd'},
	{s:'sb',d:'Sb'},
	{s:'i',d:'I'},
	{s:'ba',d:'Ba'},
	{s:'hg',d:'Hg'},
	{s:'pb',d:'Pb'},
	{s:'au',d:'Au'},
];

/*
Grammar:
S->Num M
Num-> e | 2 | 3 。。。。
M-> N End
End-> e | 2+ | 3- .....
N-> P | PN
P-> Q T
T-> e,2,3,4....
Q-> R | (N)
*/ 


function parseLittlePart(str){
	//sample input: caco、nh
	//co一般解析为CO，是Co的要特判.  Co2+，CO3，CO2，CO(
	//倒着解析?动态规划？
	var sl=str.toLowerCase();
	for (var p in chem){
		var s=chem[p].s;
		var d=chem[p].d;
		while(sl.indexOf(s)>=0)
    	sl=sl.replace(s,d);
	}

	return sl;
}

var specialIon=[
	{s:'no3-',d:'NO_3^-'},
	{s:'nh4+',d:'NH_4^+'},
	{s:'alo2-',d:'AlO_2^-'},
	{s:'no2-',d:'NO_2^-'},
	{s:'hco3-',d:'HCO_3^-'},
	{s:'clo3-',d:'ClO_3^-'},
	{s:'clo4-',d:'ClO_4^-'},
	{s:'io3-',d:'IO_3^-'},
	{s:'h2po3-',d:'H_2PO_3^-'}
];

function D(n){return /\d/.test(n);}

function parseSingleThing(str){
/*
解析某种具体物质。。。。
*/
	//sample input: 'caco3','nh4+','co(nh2)2'
	//分割成 [caco,3] [nh,4,+] [co,(,nh,2,),2]
	
	//先判断特殊离子
	var strlow=str.toLowerCase();
	for (var i in specialIon){
		if (strlow.indexOf(specialIon[i].s)>=0){
			return strlow.replace(specialIon[i].s, specialIon[i].d);
		}
	}
	//判断是不是以数字开头
	var t=0;
	var u='';
	while (/\d/.test(str[t])){
		u+=str[t];
		t++;
	}
	if (t>0)
		return u+parseSingleThing(str.substr(t));
	
	//判断是不是离子
	if ('+-'.indexOf(str[str.length-1])>=0){
		if (/\d/.test(str[str.length-2])){
			return parseSingleThing(str.substr(0,str.length-2))+'^{'+str.substr(str.length-2)+'}';
		}else{
			return parseSingleThing(str.substr(0,str.length-1))+'^'+str[str.length-1];
		}
	}

	//现在的没有开头的数字，末尾的离子，所以所有数字都是下标。

	//split成字母&其他符号 例如[co,(,nh,2,),2]  [c,6,h,1,2,o,5]
	var r=[];
	for (var i=0;i<str.length;){
		if ((str[i]>='A'&&str[i]<='Z')||(str[i]>='a'&&str[i]<='z')){
			var tmp='';
			while ((str[i]>='A'&&str[i]<='Z')||(str[i]>='a'&&str[i]<='z')){
				tmp+=str[i];
				i++;
			}
			r.push(tmp);
		}
		else{
			r.push(str[i]);
			i++;
		}
	}

	//合并各个数字，变成下标
	//如果r[i]是数字，且前后都不是数字，那就直接加上_
	//如果前后都是数字，就不处理
	//后面数字，就在前面加上_{
	//前面数字，就在后面加上}

	for (var i=0;i<r.length;i++){
		if (D(r[i])){
			if (D(r[i+1])){
				if (D(r[i-1])){

				}else{
					r[i]='_{'+r[i];
				}
			}else{
				if (D(r[i-1])){
					r[i]+='}';
				}else{
					r[i]='_'+r[i];
				}
			}
		}
	}
	//下标处理完毕
	//[co,(,nh,_2,),_2] [c,_{6,0}]

	var res='';
	for (var i in r){
		if (r[i][0].toLowerCase()>='a'&&r[i][0].toLowerCase()<='z'){
			r[i]=parseLittlePart(r[i]);
		}
		res+=r[i];
	}
	return res;
}

function parseNoSpecialStringIntoThings(str){
/*
分割加号，
注意区分化学式里面的离子符号的加号，
这样的加号之后不会是字母或者数字，
只能是字符串结束或者另一个加号
example:
	nh4++h+
split--
	'nh4','','h',''
处理：
split之后空串前面的串加上加号
*/
	if (str[0]=='+'){
		//因为shang、xia把字符串分割了，后面的加号显示不出来，特殊处理一下
		return ' + '+parseNoSpecialStringIntoThings(str.substr(1));
	}

	var splitPlus = str.split('+');
	for (var i=0;i<splitPlus.length-1;i++){
		if (splitPlus[i+1]=='')
			splitPlus[i]+='+';
	}
	//console.log('splitPlus',splitPlus);

	var noEmpty = [];
	for (var i in splitPlus)
		if (splitPlus[i]!='')
			noEmpty.push(splitPlus[i]);
	//console.log('noEmpty',noEmpty);

	var res='';
	for (var i=0;i<noEmpty.length;i++){
		res+=parseSingleThing(noEmpty[i]);
		if (i+1!=noEmpty.length)
			res+=' + ';
	}
	return res;
}


var specialSubstring=[
	{s:'=',d:'='},
	{s:'(g)',d:'(g)'},
	{s:'(l)',d:'(l)'},
	{s:'(s)',d:'(s)'},
	{s:'shang',d:'\\uparrow '},
	{s:'xia',d:'\\downarrow '},
	{s:'jiantou',d:'\\to '},
	{s:'dian',d:'\\cdot '}
];

function parseFullStringIntoNoSpecialStrings(str){
/*
分割等号
*//*
需要特殊注意的字符串：
shang、xia
(g) (l) (s)
gaowen sanjiao jiare dianran guangzhao
*/
	//去掉空格
	while (str.indexOf(' ')>=0) 
		str = str.replace(' ','');

	for (var i=0;i<specialSubstring.length;i++){
		var tmp=str.split(specialSubstring[i].s);
		if (tmp.length>1){
			var res='';
			for (var j=0;j<tmp.length-1;j++){
				res+=parseFullStringIntoNoSpecialStrings(tmp[j]);
				res+=specialSubstring[i].d;
			}
			res+=parseFullStringIntoNoSpecialStrings(tmp[tmp.length-1]);	
			return res;
		}
	}
	return parseNoSpecialStringIntoThings(str);
}

function parseString(str){
/*根据db的数据，匹配输入串*/
//  console.log(str);
  for (var p in db){
    var s=db[p].s;
    var d=db[p].d;
//  console.log(s);
    while(str.indexOf(s)>=0)
      str=str.replace(s,d);
  }
  return str;
}

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
