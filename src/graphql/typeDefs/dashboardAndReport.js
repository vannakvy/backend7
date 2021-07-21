import {gql} from 'apollo-server-express'


export default gql`

extend type Query {
    getAllProvince(district:String): AllProvince!
    getAllDistrictForMap:[AllProvince!]!
    getDataForGrap: GraphData!
  
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
type GraphData{
    cases:[Data] 
    recovered:[Data]
    deaths:[Data]
}
type Data{
    date:Date
    value: Int
}



`

