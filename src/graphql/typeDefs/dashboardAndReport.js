import {gql} from 'apollo-server-express'


export default gql`

extend type Query {
    getAllProvince: AllProvince!
    getOneProvince:[OneProvince!]!
    getHospitalForMap: [HospitalForMap]!
    getQuarantineForMap:[QuarantineForMap!]!
}

type AllProvince{
    confirmedCase:Int
    confirmedCaseToday:Int
    death: Int 
    deathToday: Int
    recovered: Int 
    recoveredToday:Int
    totalQuarantine:Int
    totalQuantineToday:Int 
    totalHospital:Int 
    totalHospitalToday:Int 
}
type OneProvince{
    confirmedCase:Int
    confirmedCaseToday:Int
    death: Int 
    deathToday: Int
    recovered: Int 
    recoveredToday:Int
    totalQuarantine:Int
    totalQuantineToday:Int 
    totalHospital:Int 
    totalHospitalToday:Int
    long:Float 
    lat:Float  
}

type HospitalForMap{
        district:String
        hospitalName: String
        long: Float 
        lat:Float 
        active:Int
        newToday:Int
        totalInHospital:Int
}

type QuarantineForMap{
    district:String
    locationName: String
    long: Float 
    lat:Float 
    active:Int
    newToday:Int
    totalInHospital:Int  
}


`