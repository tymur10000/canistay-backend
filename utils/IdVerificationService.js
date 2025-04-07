const IDAnalyzer = require("idanalyzer");

// Initialize the CoreAPI

const getAuthenticationMessage = (score) => {
  if (!score) return "Authentication failed";
  if (score > 0.5) return "The document is authentic";
  if (score > 0.3) return "The document looks suspicious";
  return "The document appears to be fake";
};

const verifyIdCard = async (filePath, faceFilePath) => {
  const CoreAPI = new IDAnalyzer.CoreAPI(process.env.IDANALYZER_API_KEY, "US");
  // Enable authentication module v2
  CoreAPI.enableAuthentication(true, 2);
  try {
    // Convert file buffers to base64
    const response = await CoreAPI.scan({
      document_primary: filePath,
      biometric_photo: faceFilePath,
    });
    if (!response.error) {
      const data_result = response.result;
      const authentication_result = response.authentication;
      const face_result = response.face;
      const verificationResult = {
        status: "pending",
        data: data_result,
        authentication: {
          score: authentication_result ? authentication_result.score : 0,
          passed: authentication_result



      return verificationResult;
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("ID verification error:", error);
    return {
      status: "failed",
      error: error.message,
      details: ["Service error occurred during verification"],
    };
  }
};

module.exports = { verifyIdCard };
