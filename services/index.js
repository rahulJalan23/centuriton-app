export const server = () => `https://e87e-49-206-245-82.in.ngrok.io/api`;

export const getShipments = () => `${server()}/shipment`;

export const cancelShipment = (id) => `${server()}/shipment/cancel/${id}`;

export const recieveShipment = (id) =>
  `${server()}/shipment/receiveShipment/${id}`;

export const shipToNext = (id) => `${server()}/shipment/shipToNext/${id}`;

export const loginApi = () => `${server()}/api/auth/login`;

export const getSelfData = () => `${server()}/api/user/me/new`;

export const getUserById = (id) => `${server()}/api/user/${id}`;

export const getAllUserShifts = () => `${server()}/api/user/userShift`;

export const getCurrentShifts = () => `${server()}/api/user/shift/current`;

export const getUserShiftById = (id) => `${server()}/api/user/userShift/${id}`;

export const getUserLogs = () => `${server()}/api/user/log`;

export const getUserShiftLogsById = (id) =>
  `${server()}/api/user/log/userShift/${id}`;

export const updateUser = () => `${server()}/api/user`;

export const getUserStatistics = () => `${server()}/api/user/statistics`;

export const getBankDetail = () => `${server()}/api/user/bankDetail`;

export const getLicenseDetails = () => `${server()}/api/user/licenses`;

export const uploadFiles = (picture) => `${server()}/api/files/${picture}`;

export const getUserDetails = () => `${server()}/api/user/me`;

export const updateBankDetail = () => `${server()}/api/user/bankDetail`;

export const submitNewLog = (id) => `${server()}/api/user/log/usershift/${id}`;

export const submitNewIncident = () => `${server()}/api/user/incident`;

export const getUserTimesheet = (id) => `${server()}/api/user/timesheet`;

export const updateUserLicense = (id) => `${server()}/api/user/licenses`;

export const getCurrentUserShift = () =>
  `${server()}/api/user/userShift/current`;

export const uploadBase64Image = () => `${server()}/api/files/base64`;

export const uploadPhoto = () => `${server()}/api/files`;

export const verifyDistanceForClockIn = (id) =>
  `${server()}/api/user/userShift/${id}/verifydistance`;

export const getAddressFromLatLng = (lat, lng) =>
  `${server()}/api/user/geocode/${lat}/${lng}/save`;

export const getStateFromLatLng = (lat, lng) =>
  `${server()}/api/user/geocode-state/${lat}/${lng}/save`;

export const getOfferedShifts = () => `${server()}/api/user/shift/offered`;

export const getAvailableShifts = () => `${server()}/api/user/shift/available`;

export const acceptShiftById = (id) =>
  `${server()}/api/user/shift/${id}/accept`;

export const declineShiftById = (id) =>
  `${server()}/api/user/shift/${id}/decline`;

export const applyShiftById = (id) => `${server()}/api/user/shift/${id}/apply`;

export const startUserShiftById = (id) =>
  `${server()}/api/user/userShift/${id}/start`;

export const endUserShiftById = (id) =>
  `${server()}/api/user/userShift/${id}/end`;

export const fileUrlByKey = (key) => `${server()}/api/files/${key}`;

export const getCurrentConversation = () =>
  `${server()}/api/chat/conversation/now`;

export const getConversationById = (id) =>
  `${server()}/api/chat/conversation/${id}`;
