const serviceAccount = require("./pk.json");
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// console.log('serviceAccount: ', serviceAccount);

const { delegation, getDelegationsInfo, setTransactions, deposit, getDelegatorData, sendGasForSubsidy, updateDelegator, createDelegator } = require('./src/delegation');
exports.getDelegatorData = getDelegatorData;
exports.deposit = deposit;
exports.delegation = delegation;
exports.getDelegationsInfo = getDelegationsInfo;
exports.setTransactions = setTransactions;
exports.sendGasForSubsidy = sendGasForSubsidy;
exports.updateDelegator = updateDelegator;
exports.createDelegator = createDelegator;

const { createDelegatee, getUserDetailByEmail, getUserDetailByWallet, getAllDelegatees, getDelegateDetail, getCurrentDelegationDetail, getPaidBorrowings, findDelegatee } = require('./src/delegatee');
exports.createDelegatee = createDelegatee;
exports.getUserDetailByEmail = getUserDetailByEmail;
exports.getUserDetailByWallet = getUserDetailByWallet;
exports.getAllDelegatees = getAllDelegatees;
exports.getDelegateDetail = getDelegateDetail;
exports.getCurrentDelegationDetail = getCurrentDelegationDetail;
exports.getPaidBorrowings = getPaidBorrowings;
exports.findDelegatee = findDelegatee;
