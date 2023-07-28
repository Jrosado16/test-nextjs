const functions = require("firebase-functions")
const admin = require('firebase-admin');
const { DELEGATEE_DB, DELEGATORS_DB, DELEGATIONS_DB } = require("./config/constants");
const { reduceDecimals } = require("./utils/decimals");
const  { firestore } = admin;
const db = firestore();
const cors = require('cors')({ origin: true });

const createDelegatee = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { company_id, email, name, chainId, delegatee_id } = req.body.data;
  
    const response = await db.collection(DELEGATEE_DB[chainId])
      .where('email', '==', email)
      .get();
      
    if (response.empty) {
      const saveData = {
        company_id,
        email,
        name,
        delegatee_id,
      }
      await db.collection(DELEGATEE_DB[chainId]).add(saveData);
    } else {
      let data = {};
      let docId = null;
      response.forEach(async (doc) => {
        data = doc.data();
        docId = doc.id;
        data.company_id = company_id;
      });
      await db.collection(DELEGATEE_DB[chainId]).doc(docId).update(data);
    }
    res.send({
      'status' : 200,
      'data' : { created: true }
    });
  });
});

const findDelegatee = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { email, chainId } = req.body.data;
    console.log('email: ', email);
  
    const response = await db.collection(DELEGATEE_DB[chainId])
      .where('email', '==', email)
      .get();

    let user = {};
    console.log('response: ', response.empty);
    if (!response.empty) {
      response.forEach((doc) => {
        user = doc.data();
      });
    }
    console.log('user: ', user);
    res.send({
      'status' : 200,
      'data' : { exist: !response.empty, user }
    });
  });
});

const getUserDetailByEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { findByData, chainId } = req.body.data;
      console.log('findByData: ', findByData);

      // getting from delegator colletion
      console.log('chainId: ', chainId);
      let response = await db.collection(DELEGATORS_DB[chainId])
        .where('email', '==', findByData)
        .get();
      // is delegator
      let userDetail = {};
      console.log('response.size: ', response.size);
      if (response.size) {
        response.forEach((doc) => {
          userDetail = doc.data();
          userDetail.isDelegator = true;
        });
      } else {
        response = await db.collection(DELEGATEE_DB[chainId])
          .where('email', '==', findByData)
          .get();

        // is delagatee
        console.log('response.size: ', response.size);
        if (response.size) {
          response.forEach((doc) => {
            userDetail = doc.data();
            userDetail.isDelegator = false;
          });
        }
      }
      res.send({
        'status': 200,
        'data': {
          userDetail
        }
      })
    } catch (error) {
      throw new functions.https.HttpsError('internal');
    }
  });
});

const getUserDetailByWallet = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { findByData, chainId } = req.body.data;
      console.log('chainId: ', chainId);
      console.log('findByData: ', findByData);

      // getting from delegator colletion
      let response = await db.collection(DELEGATORS_DB[chainId])
        .where('delegator_id', '==', findByData)
        .get();
      // is delegator
      let userDetail = {};
      if (response.size) {
        response.forEach((doc) => {
          userDetail = doc.data();
          userDetail.isDelegator = true;
        });
      } else {
        response = await db.collection(DELEGATEE_DB[chainId])
          .where('delegatee_id', '==', findByData)
          .get();

        // is delagatee
        if (response.size) {
          response.forEach((doc) => {
            userDetail = doc.data();
            userDetail.isDelegator = false;
          });
        }
      }
      res.send({
        'status': 200,
        'data': {
          userDetail
        }
      })
    } catch (error) {
      throw new functions.https.HttpsError('internal');
    }
  });
});

const getAllDelegatees = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { company_id, chainId } = req.body.data;
      console.log('company_id: ', company_id);
      const response = await db.collection(DELEGATEE_DB[chainId])
        .where('company_id', '==', company_id.toString())
        .get();
      
      let delegatees = [];
      if (response.size) {
        delegatees = await Promise.all(response.docs.map(async (doc) => {
          let delegatee = doc.data();
          const response = await db.collection(DELEGATIONS_DB[chainId])
            .where('delegatee_id', '==', delegatee.delegatee_id)
            .get();
        
          return delegatee = {
            ...doc.data(),
            delegations: response.docs.map((doc) => { 
              return {
                ...doc.data(), 
                delegation_id: doc.id
              }
            })
          }
        }));
      }
      console.log('delegatees: ', delegatees);
      res.send({
        'status': 200,
        'data': {
          delegatees
        }
      })
    } catch (error) {
      throw new functions.https.HttpsError('internal');
    }
  });
});

const calculateDelegatorInterest = (delagator_debt_onchain, delegator) => {
  const interest = reduceDecimals(delagator_debt_onchain - delegator.total_debt);
  return interest;
}

const get_delegator = async (delegator_id, chainId) => {
  let delegator = await db.collection(DELEGATORS_DB[chainId])
      .where('delegator_id', '==', delegator_id)
      .get();

  return { ...delegator.docs.map((doc) => doc.data())[0] };
}

const getCurrentDelegationDetail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log('getCurrentDelegationDetail: ');
    const { delegatee_id, delagator_debt_onchain, chainId } = req.body.data;
    console.log('req.body.data: ', req.body.data);
    const findDelegation = await db.collection(DELEGATIONS_DB[chainId])
      .where('delegatee_id', '==', delegatee_id)
      .where('is_active', '==', true)
      .get();

    console.log('findDelegation.empty: ', findDelegation.empty);
    if (findDelegation.empty) {
      res.send({
        'status': 200,
        'data': {
          delegation: [],
        }
      });
      return;
    }

    const delegation = { ...findDelegation.docs.map((doc) => ({ ...doc.data(), delegation_id: doc.id }))[0] };
    console.log('delegation: ', delegation);

    const delegator = await get_delegator(delegation.delegator_id, chainId);
    console.log('delegator: ', delegator);

    let proportion = reduceDecimals((delegation.total_principal + delegation.acumulated_interest) / delegator.total_debt);
    proportion = Number(proportion.toFixed(4));
    console.log('proportion: ', proportion);
    
    const interest_delegator = calculateDelegatorInterest(delagator_debt_onchain, delegator);
    // delegation data
    let interest_delegation = reduceDecimals((delegation.acumulated_interest + (interest_delegator * proportion)) || 0);
    console.log('interest_delegator : ', interest_delegator);
    console.log('interest_delegation: ', interest_delegation);
    delegation.acumulated_interest = interest_delegation;
    delegation.proportion = proportion;
    delegation.total_debt = reduceDecimals(delegation.total_principal + delegation.acumulated_interest);
    delegation.paid_interest = interest_delegation;
    console.log('delegation: ', delegation);

    res.send({
      'status': 200,
      'data': {
        delegation
      }
    });
  });
});

const update_delegatees_balance = async (delagator_debt_onchain, delegator_id, delegatee_id, chainId) => {
  let delegations = await db.collection(DELEGATIONS_DB[chainId])
    .where('delegator_id', '==', delegator_id)
    .where('is_active', '==', true)
    .get();

  const delegator = await get_delegator(delegator_id, chainId);
  console.log('delegator: ', delegator);
  
  Promise.all(delegations.docs.map(async (doc) => {
    const delegation_id = doc.id;
    const delegation = { ...doc.data() };
    console.log('=========================');
    console.log('delegation: ', delegation);
    // update all balance except current delegatee
    if (delegation.delegatee_id !== delegatee_id) {

      // calculate delegator interest
      const interest_delegator = reduceDecimals(delagator_debt_onchain - delegator.total_debt);
      // calculate proportion
      let proportion = reduceDecimals((delegation.total_principal + delegation.acumulated_interest) / delegator.total_debt);
      
      // calculate delegate interest
      const interest_delegatee = reduceDecimals(((interest_delegator * proportion)) || 0);
      delegation.acumulated_interest = reduceDecimals(delegation.acumulated_interest + interest_delegatee);
  		delegation.total_debt = reduceDecimals(delegation.total_principal + delegation.acumulated_interest);
      delegation.paid_interest = reduceDecimals(delegation.paid_interest + interest_delegatee);
      delegation.proportion = proportion;

      return db.collection(DELEGATIONS_DB[chainId]).doc(delegation_id).update(delegation);
    }
  }))
    .then((delegations) => {
      console.log('delegations: ', delegations);
      return delegations;
    })
    .catch((error) => {
      console.log('error: ', error);
      throw new functions.https.HttpssError('internal', error);
    })
}

const getPaidBorrowings = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { delegatee_id, chainId } = req.body.data;
    const delegations = await db.collection(DELEGATIONS_DB[chainId])
      .where('delegatee_id', '==', delegatee_id)
      .where('is_active', '==', false)
      .get();

    res.send({
      'status': 200,
      'data': {
        delegations: delegations.docs.map((doc) => ({ ...doc.data(), delegation_id: doc.id })),
      }
    })
  });
});

module.exports = {
  createDelegatee,
  getUserDetailByEmail,
  getUserDetailByWallet,
  getAllDelegatees,
  getCurrentDelegationDetail,
  update_delegatees_balance,
  getPaidBorrowings,
  findDelegatee,
}