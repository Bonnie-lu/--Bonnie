const u = require('./util')
const json5 = require('./json/result.json')
const json7 = require('./json/seven_cards_result.json')
const json4 = require('./json/five_cards_with_ghost.json')
const json6 = require('./json/seven_cards_with_ghost.json')


// 5张牌  返回（牌型，牌面，分数）
const handleFive = hand => {
  // 拆分颜色和牌面
  const {number, color, rounds} = u.handleColorAndFace(hand)
  let type;
  if(Array.from(new Set(color)).length === 1){
   //  同花前提下的牌型
   if(u.isDiffStraight(number)){
    type= 'BabyStraightFlush'
  } else if(number[0]-number[4] === 4){
     type = number[0] === 14 ? 'RoyalFlush' : 'StraightFlush'
   } else{
     type = 'Flush'
   }
  } else{
   //  同花前提下的牌型
    switch(rounds){
      case '4,1':
          type = 'FourKind'
          break;
      case '3,2':
          type = 'ThreeKindPair'
          break;
      case '3,1,1':
          type =  'ThreeKind'
          break;
      case '2,2,1':
          type = 'TwoPair'
          break;
      case '2,1,1,1':
          type = 'OnePair'
          break;
      case '1,1,1,1,1':
          type = u.isDiffStraight(number) ? 'BabyStraight': number[0]-number[4] === 4 ? 'Straight': 'HighCard'
          break;
    }
  }
  return {
    number, 
    type
  }
} 

// 7张牌  7选5选出最大的一副牌
const handleSeven = hand => {

  // 所有的排列组合 u.splitFunc指定2位的切割字符串
  const allCards = u.combine(u.splitFunc(hand, 2), 5);
  const allFive = [];

  // 转成初始的字符串类型
  allCards.map(item=>{
    allFive.push(handleFive(item.join('')))
  })
  return u.maxTypeCard(allFive)
}
// 6选4的排列
const handleFour = hand => {
  const { rounds, number, color } = u.handleColorAndFace(hand)
  let type, firstNumber = number[0];
  if(Array.from(new Set(color)).length === 1){
     //  同花前提下的牌型
     if(u.isFourDiffStraight(number)){
       type = 'BabyStraightFlush'
     } else if(number[0]-number[3] === 3 || number[0]-number[3] === 4){
      type = (number[0] === 14 && number[0]-number[3] === 3) ? 'RoyalFlush' : 'StraightFlush'
      number[0]-number[3] === 3 && number[0] !== 14? number.unshift(firstNumber+1) : number.push(15)
    } else {
      type = 'Flush'
      number.unshift(15);
    }
  } 
  else{
   //  非同花前提下的牌型
    switch(rounds){
      case '4':
        type = 'FourKind';
        number.push(15);
        break;
      case '3,1':
        type = 'FourKind';
        number.push(firstNumber);
        break;
      case '2,2':
        type = 'ThreeKindPair';
        number.unshift(firstNumber);
        break;
      case '2,1,1':
        type = 'ThreeKind';
        number.unshift(firstNumber);
        break;
      case '1,1,1,1':
        type = number[0]-number[3] === 3 || number[0]-number[3] === 4 ? 'Straight' : u.isFourDiffStraight(number) ? 'BabyStraight' : 'OnePair';
        number[0]-number[3] === 3 && number[0] !== 14 ? number.unshift(firstNumber+1) :number[0]-number[3] === 4 ? number.push(15) : number.unshift(firstNumber);
        break;
    }
  }
  return {
    number,
    type
  }
}


// 6+1张牌
const handleSix = hand => {
  // 6选5 1.先剔除ghost  2.6选5 || 6选4
  const noGhost  = u.splitFunc(hand, 2).filter(item => !item.includes('X'))
  const selectFive = u.combine(u.splitFunc(noGhost.join(''), 2), 5);
  const selectFour = u.combine(u.splitFunc(noGhost.join(''), 2), 4);
  let allFive = [], allFour = []
  selectFive.map(item => {
    allFive.push(handleFive(item.join('')))
  })
  selectFour.map(item=>{
    allFour.push(handleFour('Xn' + item.join('')))
  })
  allFive = allFive.concat(allFour)
  return u.maxTypeCard(allFive)
}

// 判断牌 5 || 4+1 || 7 || 6+1
const judgeHand = hand => {
  if(hand.length === 10){
   return hand.indexOf('X') !== -1 ? handleFour(hand) : handleFive(hand)
  }else {
   return hand.indexOf('X') !== -1 ? handleSix(hand) : handleSeven(hand)
  }
}

// Start

const timeStart = new Date().getTime()
for (const game of json4.matches) {
  const alice = judgeHand(game.alice)
  const bob = judgeHand(game.bob)
  const result = u.compare(alice, bob)
  if (result !== game.result) {
    console.error('当前手牌：')
    console.log(alice, bob)
    console.error(game)
    console.error(`错误：结果为${result}，程序终止`)
    break
  }
}

const timeEnd = new Date().getTime()
console.log(`总共耗时：${timeEnd - timeStart}ms`)