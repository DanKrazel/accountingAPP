import express from "express"
import PatientCtrl from "./patient.controller.js"


const router = express.Router()


//router.route("/").get(PatientCtrl.apiGetPatients)
//router.route("/class").get(GradesCtrl.apiGetGradesClass)

router.route("/patients")
      .get(PatientCtrl.apiGetPatients)
      .post(PatientCtrl.apiPostPatient)
      .put(PatientCtrl.apiUpdatePatient)
      .delete(PatientCtrl.apiDeletePatient)


export default router