#物理/数学公式输入

##使用方法
1. 点击第一排按钮，输入特殊格式(例如分数线)
2. 点击第二、三排按钮，插入特殊符号
3. 敲键盘输入普通的字母、数字、符号
4. 回车换行

##实现方法
1. 数据结构: 
	- 公式按下面的形式存储
   
	```js
   	['1', '2', '3', {
   		n: 'sqrt',
    	u1: [{
       		n: 'frac',
       		u1: ['1'],
       		u2: ['2', 'a', '\gamma', '\Gamma']
    	}, '\Theta']
	}]
   ```
   其中，Array存的是一个式子，数组里的每一个元素是式子中不可以被分割的一个元素。  
   "不可以被分割的元素"包括单个字符('1'、'\alpha'等)，也包括"特殊格式"。  
   "特殊格式"指的是分数线、根号等，使用形如{n:"",u1:[],u2:[]}的形式。n是该结构的名字，u1、u2数组是该结构下包含的式子。  
   
	- 上式会转换成下面的形式:   
	1 2 3 \sqrt{ \frac{ 1 }{ 2 a \gamma \Gamma } \Theta }  
    $$1 2 3 \sqrt{ \frac{ 1 }{ 2 a \gamma \Gamma } \Theta }$$

2. 如何移动光标位置  
  
       * 光标位置的存储方法:  
            使用一个整数pos。  
            这个数表示光标位于 式2 中第几个空格的位置(从0开始)  
  
       * elementSize()函数:  
            返回一个东西中的空格数(可供插入的空间数)，比如:  
                对于一个字符，就返回1(可以插在后面)，  
                空数组返回1  
                对于sqrt对象，返回其内部所有elementSize的和，最后再加一  
                对于数组[{n:sqrt,u1:[]}]，中间的对象是2，数组首部有个1  
       * 左右移动光标就是pos加加减减  
        
3. 添加元素  
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
4. 添加光标  
	原理:  
	复制一份当前的公式，将字符"□"插入到当前光标位置。在渲染成功后将这个方形变成蓝色。
	
##现有问题
1. 未实现删除功能，但预留有deleteElement函数
2. 无法输入中文
3. 第一排按钮不够直观，例如"分数线"，可改为"$\frac{□}{□}$"的图标。