import {gql} from 'apollo-server-express'


export default gql`
extend type Query {
    getPeopeleConfirmRecoverAndDeath(startDate:Date, endDate:Date):reportData
    getAllAllSampleTest:Test
    getAllProvince(district:String): AllProvince!
    getAllDistrictForMap:[AllProvince!]!
    getDataForGrap: GraphResponse
    getDataForBarGraphTotal:BarGraphTotal
    getDataForReport(startDate:Date,endDate:Date):[Report]
    affectedLocationReport(startDate:Date,endDate:Date):AffectedData 
    interviewForReport3Times:Inter
    getDataForGrapBottom:GraphResponse
}
type reportData{
    recovered:[PersonalInfo!]!
    death:[PersonalInfo!]!
    confirm:[PersonalInfo!]!
}
type Test{
today:Int 
all:Int
}
type Inter{
    totalInterview:Int
}

type AllProvince{
    sampleTest:Int,
    sampleTestToday:Int,
    confirmedCase:Int
    confirmedCaseToday:Int
    death: Int 
    deathToday: Int
    recovered: Int 
    recoveredToday:Int
    _id:String
    totalHospital:Int,
    totalHospitalization:Int,
    totalPeopleInHospitalization:Int,
    totalQuarantine:Int,
    affectedLocation:Int,
    totalPeopleInQuarantine:Int
    totalAffectedLocationOn:Int
    totalAffectedLocationClose:Int
}

type AffectedData{
  totalAffectedLocation:Int,
  totalAffectedLocationToday:Int,
  totalAffectedLocationNotClosed:Int,
  totalAffectedLocationOn:Int,
  closedLocation:Int,
  coorporateLocation:Int,
  coorporateLocationToday:Int,
  openedLocation:Int,
  openedLocationToday:Int,
  closedLocationToday:Int
  totalAffectedLocationNotClosedToday:Int
}
type Report {
        _id:String,
        menConfirmToday:Int,
       womenConfirmToday:Int,
       menConfirm:Int,
       womenConfirm:Int,
       
       menRecoveredToday:Int,
       womenRecoveredToday:Int,
       menRecovered:Int,
       womenRecovered:Int,

       menDeathsToday:Int,
       womenDeathsToday:Int,
       menDeaths:Int,
       womenDeaths:Int,
}


# create a scalar type linked from customerReserver 
# this is for helping us with object type that have dynamic key 
# scalar JSON
# type GraphResponse{
#     cases:[JSON]
#     recovered:[JSON]
#     deaths:[JSON]
# }+
type BarGraphTotal {
    confirm:Int,
    recovered:Int,
    deaths:Int
}

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

