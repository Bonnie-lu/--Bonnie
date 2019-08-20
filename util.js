const con = require('./const')
// 获取牌面分值
const getFaceScore = face => {
  switch(face) {
      case 'T':
          return 10
      case 'J':
          return 11
      case 'Q':
          return 12
      case 'K':
          return 13
      case 'A':
          return 14
      case 'X':
          return 15
      default:
          return Number(face)
  }
}

// 指定位数切割
const splitFunc = (str, count) => {
  let arr = [];
  for (let i = 0, len = str.length; i < len; i = i + 2) {
    let subStr = str.slice(i, i + count);
    arr.push(subStr);
  }
  return arr;
}

// 排列组合指定的数组 和 个数 排列组合  （7选5 21种） n= ['5r','5r','4d','6f','7f','7r','3s']
const combine = function(n, k) {
  let allArr=[],res=[]
  function dfs(idx){
      if(res.length === k){
        allArr.push(res.map(item=>item))
      }else if(res.length < k){
          for(let i= idx;i<=n.length-1;i++){
              res.push(n[i]);
              dfs(i+1); 
              res.pop();
          }  
      }
  }
  dfs(0)
  return allArr;
};

// 拆分颜色和面值
handleColorAndFace = hand => {
  let arr = hand.split('')
  let color = arr.filter((item,index)=> index % 2 !== 0 && item != 'n')
  let number = arr.filter((item,index)=> index % 2 === 0 && item != 'X').map(item => getFaceScore(item))

  let obj = {}
  number.forEach(item => obj[item]? obj[item]++ : obj[item] = 1) // obj  { '10': 1, '11': 1, '14': 3 }
  // 对number排序  牌型相同时需要number去排序
  number.sort((a,b)=>{
    if(obj[a] == obj[b]){
      return b-a
    }else{
      return obj[b]-obj[a]
    }
  })
  const rounds = Object.values(obj).sort((a,b)=>b-a).toString() // '3,2,1' 用于判断牌型
  
  return {
    color,
    number,
    rounds
  }
}

// 判断类型 1,1,1,1,1 的牌型值
const isSingle = type => {
  return [12,11,10,6,5].includes(con.map[type])
} 

// 再比较牌面大小
const compareFaceMax = (a, b) => {
  // 非对子和非高牌 通过第一个值就能比较出大小
  if(isSingle(a.type)){
     return b.number[0] > a.number[0] ? 2 : b.number[0] < a.number[0] ? 1 : 0
  } else {
    // 对子和高牌,依次比较
    for(let i = 0;i < a.number.length; i++){
      if(b.number[i] > a.number[i]){
        return 2;
      }else if(b.number[i] < a.number[i]){
        return 1;
      }
    }
    return 0;
  }
}

// 对比大小
const compare = (a, b) => {
  // 先比较牌型
  if (con.map[a.type] > con.map[b.type]) {
    return 1;
  } else if (con.map[a.type] < con.map[b.type]){
    return 2;
  } else {
    // 再比较牌面大小
    return compareFaceMax(a, b)
  }
}

// 选出最大的5张牌
const maxTypeCard = arr => {
  
  // 1.先找出当前的最大牌型,过滤出最大的牌型的组合
  const maxType = arr.sort((a,b)=> con.map[b.type]- con.map[a.type])[0].type
  const maxTypeCards = arr.filter(item => item.type === maxType)

  // 2.在牌型相同下，选出最大的组合
  let maxCard = maxTypeCards[0];
  for(let i = 1; i < maxTypeCards.length; i++){
   if(compareFaceMax(maxCard, maxTypeCards[i]) === 2){
    maxCard = maxTypeCards[i]
   }
    maxCard = maxCard
  }
  // 3.返回最大的一组牌
  return maxCard
}

// 判断是否是A5432
const isDiffStraight = hand => {
  return hand.join(',') === '14,5,4,3,2' ? true : false
}

// 四张牌 组成的A5432
const isFourDiffStraight = hand => {
  const str = hand.join(',')
  return str === '14,5,4,3' || str === '14,5,4,2' || str === '14,4,3,2' ||  str === '14,5,3,2' ? true : false
}
module.exports = {
  splitFunc,
  combine,
  handleColorAndFace,
  compareFaceMax,
  compare,
  maxTypeCard,
  isDiffStraight,
  isFourDiffStraight
}