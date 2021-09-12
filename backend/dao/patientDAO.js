import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let patients

export default class PatientDAO {
  static async injectDB(conn) {
    if (patients) {
      return
    }
    try {
      patients = await conn.db(process.env.RESTREVIEWS_NS).collection("patients")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async getPatients(filters=null){
    let query
    if (filters) {
      if ("name" in filters) {
        query = { "name": { $eq: filters["name"] } }
      } else if ("devise" in filters) {
        query = { "devise": { $eq: filters["devise"] } }
    }
    let cursor
    try {
      console.log(query)
      cursor = await patients
        .find(query)
    } catch(e) {
      console.error(`Unable to issue find command, ${e}`)
      return { patientsList: [], totalNumPatients: 0 }
    }


    try {
      const patientsList = await cursor.toArray()
      const totalNumPatients = await patients.countDocuments(query)

      return { patientsList, totalNumPatients }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { patientsList: [], totalNumPatients: 0 }
    }
  }

  static async addPatient( userID, patient) {
    console.log(patient)
    try {
      const patientDoc = { 
          name: patient.name,
          price: patient.price,
          devise: patient.devise,
          date: patient.date,
          user_id: ObjectId(userID) }

      return await patients.insertOne(patientDoc)
    } catch (e) {
      console.error(`Unable to add patient: ${e}`)
      return { error: e }
    }
  }

  static async updatePatient(patient_id, userId, price, date) {
    try {
      const updateResponse = await patients.updateOne(
        { user_id: ObjectId(userId), 
          _id: ObjectId(patient_id)},
        { $set: { price: price, date: date  } },
      )
      return updateResponse
    } catch (e) {
      console.error(`Unable to update patient: ${e}`)
      return { error: e }
    }
  }

  static async deletePatient(patientId, userId) {
    try {
      const deleteResponse = await patients.deleteOne({
        _id: ObjectId(patientId),
        user_id: ObjectId(userId),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete patient: ${e}`)
      return { error: e }
    }
  }

}