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
  for (let i = 0, len = str.length / count; i < len; i++) {
    let subStr = str.substr(0, count);
    arr.push(subStr);
    str = str.replace(subStr, "");
  }
  return arr;
}


// 指定的数组 和 个数 排列组合  （7选5 21种可能）
const combine = function(n, k) {
  let allArr=[],res=[]
  function dfs(idx){
      if(res.length === k){
        allArr.push(res.map(item => item));
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
  let handArr = hand.split('')
  let obj = {}
  let color = handArr.filter((item,index)=> index % 2 !== 0).filter(item=> item != 'n')
  let number = handArr.filter((item,index)=> index % 2 === 0)
  // 剔除ghost
  number = number.map(item => getFaceScore(item)).filter(item => item != 15 )
  // obj  { '10': 1, '11': 1, '14': 3 }  
  number.forEach(item => obj[item]? obj[item]++ : obj[item] = 1)
  // 对number排序  牌型相同时需要number去排序
  number.sort((a,b)=>{
    if(obj[a] == obj[b]){
      return b-a
    }else{
      return obj[b]-obj[a]
    }
  })
  // rounds  obj -> '3,1,1'  用于判断牌型
  const rounds = Object.values(obj).sort((a,b)=>b-a).toString()
  return {
    color,
    number,
    rounds
  }
}

// 再比较牌面大小
const compareFaceMax = (a, b) => {
  for(let i = 0;i < a.number.length; i++){
    if(b.number[i] > a.number[i]){
      return 2;
    }else if(b.number[i] < a.number[i]){
      return 1;
    }
  }
  return 0;
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
  
  // 1.先找出当前的最大牌型  reduce 限定一个最小牌型为初始值
  const maxType = arr.reduce((a,b) => {
    const type = con.map
    return type[a.type] <= type[b.type] ? b : a
  }, {type: 'HighCard'}).type
  const maxTypeCards =  arr.filter(item => item.type === maxType)

  // 2.牌型相同下，筛选最大的5张牌
  let maxTypeCard = maxTypeCards[0];
  for(let i = 1; i < maxTypeCards.length; i++){
   if(compareFaceMax(maxTypeCard, maxTypeCards[i]) === 2){
    maxTypeCard = maxTypeCards[i]
   }
    maxTypeCard = maxTypeCard
  }
  return maxTypeCard
}

// 判断是否是A5432
const isDiffStraight = hand => {
  return hand.join(',') === '14,5,4,3,2' ? true : false
}
module.exports = {
  splitFunc,
  combine,
  handleColorAndFace,
  compareFaceMax,
  compare,
  maxTypeCard,
  isDiffStraight
}