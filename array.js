let oldArr = [10,20,"hello"];


// let newArr = [];
// let i =0;

// for(i;i<oldArr.length;i++){
//     if(oldArr[i] !=="hello") 
//         newArr.push(oldArr[i])
      
// }
let news = [];
 oldArr.map(a=>{
       if(a !=="hello")   news.push(a)
});

function funName(e){
    if(e!=="hello"){
        return true
    }
}

// let a = oldArr.find(a=>a==="hello");
let a = oldArr.filter(function(e){
    if(e!=="hello") return true
});
console.log(a)