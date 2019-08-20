// 假如电子记时器所显示的十个数字是“0126093028”这样一串数，它表示的是1月26日9时30分28秒。
// 在这串数里，“0”出现了3次，“2”出现了2次，“1”、“3”、“6”、“8”、“9”各出现1次，而“4”、“5”、“7”没有出现。
// 如果在电子记时器所显示的这串数里，“0，1，2，3，4，5，6，7，8，9”这一个数字都只出现一次，称它所表示的时刻为“十全时”那么2003年一共有（ ）个这样的“十全时”。
// 请用自己最擅长的编程语言，写一段代码求解.


function permute(temArr,testArr){
  var permuteArr=[];
  var arr = testArr;
  function innerPermute(temArr){
        for(var i=0,len=arr.length; i<len; i++) {
            if(temArr.length == len - 1) {
                if(temArr.indexOf(arr[i]) < 0) {
                    permuteArr.push(temArr.concat(arr[i]));
                }
                continue;
            }
            if(temArr.indexOf(arr[i]) < 0) {
                innerPermute(temArr.concat(arr[i]));
            }
        }
    }
  innerPermute(temArr)
  return permuteArr
}
let start = new Date()
const tenCount = (year)=> {

  // 经过分析假如润年多出一天2.29,但是存在两个2,这个也是一个废掉的数,所以不需要考虑平年和润年
  //[#,#,#,#,#,#,#,#,#,#] 月份只能以0开头,假如
  //[0,#,1,#,2,#,#,#,#,#] -> [0,#,1,#,2,3,4,#,5,#][0,#,1,#,2,3,5,#,4,#]
  //[0,#,2,#,1,#,#,#,#,#] -> [0,#,2,#,1,#,4,#,5,#][0,#,2,#,1,#,5,#,4,#][0,#,2,#,1,#,3,#,4,#][0,#,2,#,1,#,3,#,5,#][0,#,2,#,1,#,4,#,3,#][0,#,2,#,1,#,5,#,3,#]
  const count1 = permute([],4).length * 2
  const count2 = permute([],5).length * 6
  return count1+count2
}
tenCount(2003)
let end = new Date()
console.log(`${end-start}ms`)