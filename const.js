// 定义颜色
const colors = ['s', 'h', 'd', 'c']

// 定义牌型
const map = {
    RoyalFlush: 12,
    StraightFlush: 11,
    BabyStraightFlush: 10,
    FourKind: 9,
    ThreeKindPair: 8,
    Flush: 7,
    Straight: 6,
    BabyStraight:5,
    ThreeKind: 4,
    TwoPair: 3,
    OnePair: 2,
    HighCard: 1,
}

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

module.exports = {
   colors,
   map
}