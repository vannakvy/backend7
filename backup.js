
      // const convert =(arr)=>{
      //   let limit = 15;
      //   var result = {};
      //   for (var i = 0; i < limit; i++) {

      //     if(arr[i]._id.month !== null) {
      //       let a = `${arr[i]._id.month}`
      //       console.log(a)
      //       result[a] = arr[i].confirm;
      //     }

      //   }
      //   console.log(result,"fff")
      //   return result;
      // }

      //   const convert = (e) => {
      //     let array = {}
      //     let limitDate = 4
      //     e.map(load => {
      //         var y =`${load._id.month}/${load._id.day}/${load._id.year}`
      //         if (load._id.month !== null) {
      //             if (new Date(y).getDate() > new Date().getDate() - limitDate && new Date(y).getDate() >= 0) {
      //                 let x = { [y]: load.confirm }
      //                 array = {...array, ...x}
      //             }
      //         }
      //     })
      //    return array;
      // }

      // let confirm = await PersonalInfo.aggregate([
      //   {
      //     $group: {
      //       _id: {
      //         month: { $month: "$currentState.confirmedAt" },
      //         day: { $dayOfMonth: "$currentState.confirmedAt" },
      //         year: { $year: "$currentState.confirmedAt" },
      //       },
      //       value: { $sum: 1 },
      //     },
      //   },
      // ]);
      // let recovered = await PersonalInfo.aggregate([
      //   {
      //     $group: {
      //       _id: {
      //         month: { $month: "$currentState.recoveredAt" },
      //         day: { $dayOfMonth: "$currentState.recoveredAt" },
      //         year: { $year: "$currentState.recoveredAt" },
      //       },
      //       value: { $sum: 1 },
      //     },
      //   },{
          
      //       $sort:{"currentState.recoveredAt":1}
          
      //   }
      // ]);

      // let deathAt = await PersonalInfo.aggregate([
      //   {
      //     $group: {
      //       _id: {
      //         month: { $month: "$currentState.deathAt" },
      //         day: { $dayOfMonth: "$currentState.deathAt" },
      //         year: { $year: "$currentState.deathAt" },
      //       },
      //       value: { $sum: 1 },
      //     },
        
      //   },
      // ]);


         // const convert =(arr)=>{
      //   let limit = 15;
      //   var result = {};
      //   for (var i = 0; i < limit; i++) {

      //     if(arr[i]._id.month !== null) {
      //       let a = `${arr[i]._id.month}`
      //       console.log(a)
      //       result[a] = arr[i].confirm;
      //     }

      //   }
      //   console.log(result,"fff")
      //   return result;
      // }

      //   const convert = (e) => {
      //     let array = {}
      //     let limitDate = 4
      //     e.map(load => {
      //         var y =`${load._id.month}/${load._id.day}/${load._id.year}`
      //         if (load._id.month !== null) {
      //             if (new Date(y).getDate() > new Date().getDate() - limitDate && new Date(y).getDate() >= 0) {
      //                 let x = { [y]: load.confirm }
      //                 array = {...array, ...x}
      //             }
      //         }
      //     })
      //    return array;
      // }