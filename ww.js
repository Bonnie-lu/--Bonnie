// let obj = {}, color = [], number= []
// for(let i = 0; i < arr.length; i++){
//   if(arr[i] != 'n' && arr[i] != 'X'){
//     let cur = arr[i]
//     con.colors.includes(cur) ? color.push(cur) : number.push(getFaceScore(cur))
//   }
// }
const splitFunc = (str, count) => {
  let arr = [];
  for (let i = 0; i < str.length; i = i+2) {
    arr.push(str.slice(i, i+count));
  }
  console.log(arr)
  return arr
}
splitFunc('8h9h8h8h8h8h', 2)