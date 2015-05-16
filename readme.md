#说明：

* 功能：输入类似于sio32-+h2o+co2=co32-+h2sio3xia的字符串，转换为类似于SiO_3^{2-} + H_2O + CO_2=CO_3^{2-} + H_2SiO_3\downarrow 的LaTeX公式格式，并在下方渲染成化学方程式。  
* 实现：index.html包含两个textarea，其中id为testIn的接收公式的输入。在mainChem.js文件中有一个100ms的计时器，每次触发调用commit()函数，将textIn的数据转换为LaTeX格式。当textIn的数据发生了变化，即调用render()函数将公式渲染出来。
* 输入串的解析方式：
	* parseFullStringIntoNoSpecialStrings：找到原始输入串中的特殊子串，包括(g)、(l)、(s)、shang、xia、=、jiantou、dian等，用这些子串做split分割，直至不能分割为止。  
	例如：sio32-+h2o+co2=co32-+h2sio3xia会变成["sio32-+h2o+co2","=","co32-+h2sio3","xia"]，将这里面的xia和=分别转成\downarrow和=，对剩下的两个字符串使用parseNoSpecialStringIntoThings函数。最后将这些结果连接起来。
	* parseNoSpecialStringIntoThings：分割成各个物质，例如co32-+h2sio3变成["co32-","+","h2sio3"]，对每个物质使用parseSingleThing函数，最终连接起来。
	* parseSingleThing：详见代码的注释。在这一步处理下标等，分割出来连续的英文字母，交给parseLittlePart。例如co(nh2)2变成['co','(','nh','_2',')','_2']，c60变成['c','_{60}']。
	* parseLittlePart：用于处理一串英文字母，遍历元素周期表，将匹配的元素名都替换掉。
* 公式的显示：使用了MathJax。参见render函数，每次渲染前要删掉之前渲染搞出的div。