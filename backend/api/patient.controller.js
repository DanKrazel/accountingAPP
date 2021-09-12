import PatientDAO from "../dao/patientDAO.js"

export default class PatientController {

  static async apiGetPatients(req, res, next) {
    try {
      let patientsList = await PatientDAO.getPatients()
      res.json(patientsList)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostPatient(req, res, next) {
    try {
      //const restaurantId = req.body.restaurant_id
      const userID = req.body.user_id
      const patientInfo = {
        name: req.body.name, 
        price: req.body.price,
        devise: req.body.devise,
        date: req.body.date
      }
      console.log(userID)
      const PatientResponse = await PatientDAO.addPatient(
        //restaurantId,
        userID,
        patientInfo,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdatePatient(req, res, next) {
    try {
      const userID = req.body.user_id
      const patient_id = req.body.patient_id
      const price = req.body.price
      const date = req.body.date

      const PatientResponse = await PatientDAO.updatePatient(
        patient_id,
        userID,
        price,
        date,
      )

      var { error } = PatientResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (PatientResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update patient - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeletePatient(req, res, next) {
    try {
      const patientId = req.body.patient_id
      const userId = req.body.user_id
      console.log(patientId)
      const patientResponse = await PatientDAO.deletePatient(
        patientId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}