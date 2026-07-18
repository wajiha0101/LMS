const { sendSuccess } = require("../../utils/ApiResponse");
const { listCertificates, getCourseCertificate } = require("./certificates.service");

async function listCertificatesController(req, res, next) {
  try {
    const certificates = await listCertificates(req.user.id);
    sendSuccess(res, certificates);
  } catch (error) {
    next(error);
  }
}

async function getCourseCertificateController(req, res, next) {
  try {
    const certificate = await getCourseCertificate(req.params.id, req.user.id);
    sendSuccess(res, certificate);
  } catch (error) {
    next(error);
  }
}

module.exports = { listCertificatesController, getCourseCertificateController };
