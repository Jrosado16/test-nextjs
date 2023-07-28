const functions = require("firebase-functions")
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const  { firestore } = admin;
const db = firestore();
const { ethers, utils } = require('ethers');
const { DELEGATORS_DB, DELEGATIONS_DB, FAUCET_DB, TRANSACTIONS_DB, rpc } = require("./config/constants");
const cors = require('cors')({ origin: true });

const mnemonic = defineSecret('MNEMONIC')
const alchemyApiMainnet = defineSecret('ALCHEMY_API_MAINNET')
const alchemyApiTestnet = defineSecret('ALCHEMY_API_TESTNET')

const { update_delegatees_balance } = require('./delegatee');
const { reduceDecimals } = require("./utils/decimals");

const ERC20 = require('../abis/IERC20.json');

const subsidyAmount = 0.02 // 35 usd eth May 25
const daysBetweenDrops = 60 // Every 60 days a user is eligible for airdrop
const minimalBalanceForEligibility = 0.01

const createDelegator = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { email, address, company_id, chainId } = req.body.data;
  
    const response = await db.collection(DELEGATORS_DB[chainId])
      .where('email', '==', email)
      .get();
      
    if (response.empty) {
      const saveData = {
        acumulated_interest: 0,
        company_id,
        delegated: 0,
        delegator_id: address,
        deposit: 0,
        email,
        total_debt: 0,
        total_principal: 0,
      }
      await db.collection(DELEGATORS_DB[chainId]).add(saveData);
    } else {
      let data = {};
      let docId = null;
      response.forEach(async (doc) => {
        data = doc.data();
        docId = doc.id;
      });
      await db.collection(DELEGATORS_DB[chainId]).doc(docId).update(data);
    }
    res.send({
      'status' : 200,
      'data' : { created: true }
    });
  });
});

const deposit = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { tx, chainId, params } = req.body.data;
    console.log('req.body.data: ', req.body.data);
    const txResponse = await waitForTransaction(tx, chainId);
    if (txResponse.status !== 1) throw new functions.https.HttpsError('internal');
  
    const response = await db.collection(DELEGATORS_DB[chainId])
      .where('delegator_id', '==', params.delegator_id)
      .get();
      
    if (response.empty) { // TODO:exists
      const saveData = {
        delegator_id: params.delegator_id,
        deposit: params.deposit,
        delegated: 0,
        total_principal: 0,
      }
      await db.collection(DELEGATORS_DB[chainId]).add(saveData);
    } else {
      let data = {};
      let docId = null;
      response.forEach(async (doc) => {
        data = doc.data();
        docId = doc.id;
      });
      data.deposit = Number(data.deposit.toFixed(4)) + Number(params.deposit.toFixed(4))
      await db.collection(DELEGATORS_DB[chainId]).doc(docId).update(data);
    }
    res.send({
      'status' : 200,
      'data' : { receipt: txResponse }
    });
  });
});

const delegation = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    const { tx, chainId, params } = req.body.data;
    console.log('req.body.data: ', req.body.data);

    const txResponse = await waitForTransaction(tx, chainId);
    if (txResponse.status !== 1) throw new functions.https.HttpsError('internal');

    await setFirestoreDelegationData(params, chainId);
    res.send({
      'status' : 200,
      'data' : { receipt: txResponse }
    });
  })
});

const setFirestoreDelegationData = async (params, chainId) => {
  const { delegator_id, amount } = params;

  const { delegatorId, delegatorData } = await getDelegator(delegator_id, chainId);
  console.log('delegatorData: ', delegatorData);
  
  delegatorData.delegated += amount;
  params.total_principal = 0;
  params.total_debt = 0;
  params.acumulated_interest = 0;
  params.proportion = 0;
  params.is_active = true;
  params.start_date = new Date();
  params.end_date = null;
  params.paid_interest = 0;
  params.total_borrow = 0;
  await db.collection(DELEGATIONS_DB[chainId]).add(params);
  return db.collection(DELEGATORS_DB[chainId]).doc(delegatorId).update(delegatorData);
}

const getDelegationsInfo = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { delegatee, chainId } = req.body.data;
    
    const response = await db.collection(DELEGATIONS_DB[chainId])
      .where('delegatee_id', '==', delegatee)
      .where('is_active', '==', true)
      .get();
  
    Promise.all(response.docs.map(async (doc) => {
      console.log('doc.data(): ', doc.data());
      const delegateeInfo = { ...doc.data(), delegation_id: doc.id };
      return delegateeInfo;
    }))
      .then((delegateeInfo) => {
        console.log('dataResponse: ', delegateeInfo);
        res.send({
          'status' : 200,
          'data' : delegateeInfo
        });
      }) 
  })
});

const setTransactions = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { tx, params, chainId } = req.body.data;
    const { amount, transaction_type, delegation_id, delagator_debt_onchain } = params;
    const parsedAmount = Number(amount.toFixed(6));

    const txResponse = await waitForTransaction(tx, chainId);
    if (txResponse.status !== 1) throw new functions.https.HttpssError('internal');
    
    if (transaction_type === 'borrow') {
      await borrow(parsedAmount, delagator_debt_onchain, delegation_id, chainId);
    } else {
      await repay(parsedAmount, delagator_debt_onchain, delegation_id, chainId);
    }

    const docTransaction = await db.collection(TRANSACTIONS_DB[chainId]).doc(delegation_id).get();

    const saveData = {
      hash: tx.hash,
      amount: amount,
      transaction_type: transaction_type,
      timestamp: new Date()
    };

    if (docTransaction.exists) {
      await db.collection(TRANSACTIONS_DB[chainId]).doc(delegation_id).update({
        [saveData.hash]: {
          ...saveData
        }
      })
    } else {
      await db.collection(TRANSACTIONS_DB[chainId]).doc(delegation_id).set({
        [saveData.hash]: {
          ...saveData
        }
      })
    }

    res.send({
      'status' : 200,
      'data' : { receipt: txResponse }
    });
  })
});

const get_delegation = async (delegation_id, chainId) => {
  let delegation = await db.collection(DELEGATIONS_DB[chainId]).doc(delegation_id).get();
  return delegation.data();
}

const borrow = async (amount, delagator_debt_onchain, delegation_id, chainId) => {
  console.log('delagator_debt_onchain: ', delagator_debt_onchain);
  const delegation = await get_delegation(delegation_id, chainId);
  console.log('delegation: ', delegation);
  const { delegatorId, delegatorData } = await getDelegator(delegation.delegator_id, chainId);
  console.log('delegatorData: ', delegatorData);

  // calcular interest delegator
  const interest_delegator = reduceDecimals(delagator_debt_onchain - delegatorData.total_debt);
	console.log('interest_delegator', interest_delegator);
  // calcular proporcion
  let proportion = reduceDecimals((delegation.total_principal + delegation.acumulated_interest) / delegatorData.total_debt);
	console.log('proportion', proportion);

  // delegado
  let interest_delegatee = reduceDecimals((delegation.acumulated_interest + (interest_delegator * proportion)) || 0);
	console.log('interest_delegatee', interest_delegatee);
  
  // update current delegatee
  delegation.acumulated_interest = interest_delegatee;
  delegation.total_principal = reduceDecimals(delegation.total_principal + amount);
  delegation.total_debt = reduceDecimals(delegation.total_principal + interest_delegatee);
  delegation.proportion = proportion || 0;
  delegation.paid_interest = interest_delegatee;
  delegation.total_borrow = reduceDecimals(delegation.total_borrow + amount);
  console.log('delegation: ', delegation);
  
  // update all delgatees
  await update_delegatees_balance(delagator_debt_onchain, delegation.delegator_id, delegation.delegatee_id, chainId);
  console.log('// update delegator: ');
  
  // update delegator
  delegatorData.total_debt = reduceDecimals(delagator_debt_onchain + amount);
  delegatorData.total_principal = reduceDecimals(delegatorData.total_principal + amount);
  await db.collection(DELEGATORS_DB[chainId]).doc(delegatorId).update(delegatorData);

  return db.collection(DELEGATIONS_DB[chainId]).doc(delegation_id).update(delegation);
}

const repay = async (amount, delagator_debt_onchain, delegation_id, chainId) => {
  console.log('=============repay init=============');
  const delegation = await get_delegation(delegation_id, chainId);
  const { delegatorId, delegatorData } = await getDelegator(delegation.delegator_id, chainId);

	let proportion = reduceDecimals((delegation.total_principal + delegation.acumulated_interest) / delegatorData.total_debt);
  console.log('proportion: ', proportion);
  
  const interest_delegator = reduceDecimals(delagator_debt_onchain - delegatorData.total_debt);
  console.log('interest_delegator: ', interest_delegator);
  
  // delegado
  let interest_delegatee = reduceDecimals((delegation.acumulated_interest + (interest_delegator * proportion)) || 0);
  console.log('interest_delegatee: ', interest_delegatee);
  
  const reduce_interes = reduceDecimals(amount >= delegation.total_principal ? amount - delegation.total_principal : 0);
  console.log('reduce_interes', reduce_interes);
  delegation.acumulated_interest = amount >= delegation.total_debt ? 0 : reduceDecimals(interest_delegatee - reduce_interes);
  delegation.total_debt = reduceDecimals(delegation.total_principal + interest_delegatee - amount);
  console.log('delegation.total_debt: ', delegation.total_debt);
  
  const delegatee_principal = delegation.total_principal;
  delegation.total_principal = amount >= delegation.total_principal ? 0 : reduceDecimals(delegation.total_principal - amount);
  console.log('delegation.total_principal: ', delegation.total_principal);
  delegation.proportion = amount >= delegation.total_debt ? 0 : proportion || 0;
  delegation.paid_interest = interest_delegatee;
  delegation.is_active = delegation.total_debt > 0;
  delegation.end_date = delegation.total_debt > 0 ? null : new Date();
  console.log('delegation: 229 delegations', delegation);

  // update all delgatees
  await update_delegatees_balance(delagator_debt_onchain, delegation.delegator_id, delegation.delegatee_id, chainId);

  // update delegator
  delegatorData.total_debt = amount >= delegatorData.total_debt ? 0 : reduceDecimals(delagator_debt_onchain - amount);
  const value = amount >= delegatee_principal ? delegatee_principal : amount
  delegatorData.total_principal = reduceDecimals(delegatorData.total_principal - value);
  
  await db.collection(DELEGATORS_DB[chainId]).doc(delegatorId).update(delegatorData);
  console.log('=============repay finish=============');
  return db.collection(DELEGATIONS_DB[chainId]).doc(delegation_id).update(delegation);
}

const getDelegatorData = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { delegator_id, chainId } = req.body.data;
    const { delegatorData } = await getDelegator(delegator_id, chainId);
    res.send({
      'status': 200,
      'data': delegatorData,
    });
  });
});

const sendGasForSubsidy = functions.runWith({ secrets: [mnemonic, alchemyApiMainnet, alchemyApiTestnet] }).https.onRequest((req, res) => {
  cors(req, res, async () => {

    // 1. Check if the current user's address is valid
    const { userAddress, chainId } = req.body.data;
    if (chainId === 1101) {
      res.send({
        'status' : 200,
        'data' : { eligible: false }
      });
      return;
    }
    if (!ethers.utils.isAddress(userAddress)) 
        throw new functions.https.HttpsError('invalid-argument','The address is not a valid Ethereum Address')

    if (!chainId || typeof chainId !== 'number') throw new functions.https.HttpsError('invalid-argument','The chainID is invalid')

    const ALCHEMY_PROVIDER_URL = {
      1442: 'https://polygonzkevm-testnet.g.alchemy.com/v2',
      1101: 'https://polygonzkevm-mainnet.g.alchemy.com/v2'
    };
    
    const ALCHEMY_API = {
      1442: alchemyApiTestnet.value(),
      1101: alchemyApiMainnet.value(),
    };

    const alchemyUrl = `${ALCHEMY_PROVIDER_URL[chainId]}/${ALCHEMY_API[chainId]}`;
    const alchemyProvider = ethers.getDefaultProvider(alchemyUrl, {alchemy: ALCHEMY_API[chainId] });
    const wallet = ethers.Wallet.fromMnemonic(mnemonic.value())   
    // 2. Check if he is already registered in the subsidy collection
    try {
      let doc = await db.collection(FAUCET_DB[chainId]).doc(userAddress).get()
      if(doc.exists) {
        const docData = doc.data()
        const eligibilityCriteria =  {
          time: false,
          balance: false,
        }
        // Check if user is eligible
        let eligible = false
        if(!docData.eligible){
          const currentDate = Math.floor(Date.now() / 1000)
          const differenceInDays = (currentDate - docData.airdropTimestamp._seconds) / (60 * 60 * 24);
          const eligibleTime = differenceInDays > daysBetweenDrops
          const eligibleBalance = Number(await alchemyProvider.getBalance(userAddress))/1e18  < minimalBalanceForEligibility
          eligibilityCriteria.time = eligibleTime
          eligibilityCriteria.balance = eligibleBalance
          eligible = eligibleTime && eligibleBalance
          await db.collection(FAUCET_DB[chainId]).doc(userAddress).update({eligible})
        }

        if(docData.eligible || eligible) {
          const receipt = await sendTransaction(wallet, alchemyProvider, wallet.address, userAddress, subsidyAmount, chainId)
          res.send({
            'status' : 200,
            'data' : { eligible, receipt }
          });
        }
        // If the user is not eligible
        else {
          res.send({
            'status' : 200,
            'data' : { eligible, eligibilityCriteria }      
          })
        }
      }
      else{
        // 3. If not in the collection add him and send gas 
        const eligible = Number(await alchemyProvider.getBalance(userAddress))/1e18  < minimalBalanceForEligibility        
        if(eligible) {
          const receipt = await sendTransaction(wallet, alchemyProvider, wallet.address, userAddress, subsidyAmount, chainId)
          res.send({
            'status' : 200,
            'data' : { eligible, receipt }
          });
        } else {
          res.send({
            'status' : 200,
            'data' : { eligible }      
          })          
        }
        
      }
    } catch (error) {
        res.send({
          'status': 500,
          'data': error
        })
        throw new functions.https.HttpsError('internal',error)      
    }
  });
});

const waitForTransaction = async (tx, chainId) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc[chainId]);
  const response = await provider.waitForTransaction(tx.hash);
  return response;
}

const findDelegatorAndDelegatee = async (chainId, delegator_id, delegatee_id) => {
  const response = await db.collection(DELEGATIONS_DB[chainId])
    .where('delegator_id', '==', delegator_id)
    .where('delegatee_id', '==', delegatee_id)
    .where('is_active', '==', true)
    .get();
  return response;
}

const getDelegator = async (delegator_id, chainId) => {
  const delegator = await db.collection(DELEGATORS_DB[chainId])
    .where('delegator_id', '==', delegator_id)
    .get();
  let delegatorId = null;
  let delegatorData = {};
  delegator.forEach((doc) => {
    delegatorId = doc.id;
    delegatorData = doc.data();
  });

  return { delegatorId, delegatorData };
}

const sendTransaction = async (signer, provider, from, destination, amount, chainId) => {
  // const value = ethers.utils.parseEther(amount.toString());
  // const gasPrice = await provider.getGasPrice();
  // const transactionConstructor = {
  //   from,
  //   to: destination,
  //   data: '0x',
  //   value: value.toString(),
  //   gasPrice,
  //   gasLimit: 600000,
  // }
  try {
      await db.collection(FAUCET_DB[chainId]).doc(destination).set({
        destination,
        airdropped: false,
        eligible: true,
        airdropTimestamp: firestore.FieldValue.serverTimestamp()
      });
      const previousBalance = Number(await provider.getBalance(destination))/1e18
      // const tx = await signer.connect(provider).sendTransaction(transactionConstructor)
      // await tx.wait();
      // TODO: send USDC = 100 decimal: 6 and WBTC = 0.05 decimal: 8
      await send_USDC_And_WHTC_Token(signer, provider, from, destination);
      //Check success
      const newBalance = Number(await provider.getBalance(destination))/1e18 
      console.log('newBalance: ', newBalance);
      console.log('previousBalance: ', previousBalance);
      if(newBalance > previousBalance) {
          await db.collection(FAUCET_DB[chainId]).doc(destination).update({
              airdropped: true,
              eligible: false,
              airdropTimestamp: firestore.FieldValue.serverTimestamp()            
          })
          const doc = await db.collection(FAUCET_DB[chainId]).doc(destination).get()
          return doc.data()
      }
      throw new functions.https.HttpsError('internal','Error while updating database')
  } catch (error) {
      throw new functions.https.HttpsError('internal',error)
  }
}
const updateDelegator = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { chainId, email, address } = req.body.data;
    console.log(' req.body.data: ',  req.body.data);
  
    const response = await db.collection(DELEGATORS_DB[chainId])
      .where('email', '==', email)
      .get();
      
    let data = {};
    let docId = null;
    response.forEach(async (doc) => {
      data = doc.data();
      docId = doc.id;
    });
    console.log('response: ', response);
    data.delegator_id = address;
    await db.collection(DELEGATORS_DB[chainId]).doc(docId).update(data);
    res.send({
      'status' : 200,
      'data':data,
    });
  });
});

const send_USDC_And_WHTC_Token = async (signer, provider, from, destination) => {
  try {
    const parsedAmountUSDC = ethers.utils.parseUnits('100', 6);
    const parsedAmountWETH = ethers.utils.parseUnits('0.01');
    const gasPrice = await provider.getGasPrice();
    const transactionConstructor = {
      from,
      to: destination,
      data: '0x',
      value: parsedAmountWETH,
      gasPrice,
      gasLimit: 600000,
    }
    signer = signer.connect(provider);
    const usdcDebtContract = new ethers.Contract('0xEc36899D4Cd6f72ba610aF6AC3B60ed1e954124a', ERC20.abi, signer);
    const tx1 = await usdcDebtContract.transfer(destination, parsedAmountUSDC);
    console.log('tx1: ', tx1);
    const tx2 = await signer.sendTransaction(transactionConstructor);
    console.log('tx2: ', tx2);
    return tx2.wait();
  } catch (error) {
    console.log('error message: ', error.message);
    console.log('error: ', error);
  }
}


module.exports = {
  delegation,
  sendGasForSubsidy,
  getDelegatorData,
  setTransactions,
  deposit,
  getDelegationsInfo, 
  updateDelegator,
  createDelegator,
}