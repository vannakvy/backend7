import {gql} from 'apollo-server-express'


export default gql`

extend type Query {
    getAllProvince(district:String): AllProvince!
    getAllDistrictForMap:[AllProvince!]!
    getDataForGrap: GraphResponse
    getDataForReport:AllProvince
  
}

type AllProvince{
    confirmedCase:Int
    confirmedCaseToday:Int
    death: Int 
    deathToday: Int
    recovered: Int 
    recoveredToday:Int
    _id:String
    
}

# create a scalar type linked from customerReserver 
# this is for helping us with object type that have dynamic key 
# scalar JSON
# type GraphResponse{
#     cases:[JSON]
#     recovered:[JSON]
#     deaths:[JSON]
# }

scalar JSON
type GraphResponse{
    cases:[Graps]
    recovered:[Graps]
    deaths:[Graps]
}


type Graps{
    x: String
    y:Int
}





`

