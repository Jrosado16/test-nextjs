const delegate = {
	acumulated_interest: 0,
  porportion: 0,
  total_debt: 0,
  total_peincipal: 0,
  id: 1,
}

const delegation = [];

const delegator = {
  acumulated_interes: 0,
  delegated: 0,
  total_principal: 0,
  total_debt: 0,
  id: 1,
}
// deluda delegador on-chain;
let deuda_delegator_onchain = 0;
// creacion del delegador

const delegationFt = (amount, delegatee_id, delegator_id) => {
  const delegation_user = {
    acumulated_interest: 0,
    proportion: 0,
    total_debt: 0,
    total_principal: 0,
    delegatee_id,
    delegated_amount: amount,
	}
  delegation.push(delegation_user);
}
delegationFt(100, 1, 1);

const calculateDelegatorInterest = (deudaDelegador_onchain) => {
  const interest = deudaDelegador_onchain - delegator.total_debt;
  return Number(interest.toFixed(6));
}

const update_delegatees_balance = (deudaDelegador_onchain, delegatee_id) => {
  delegation.map((data) => {
    const delegatee = { ...data };
    if (delegatee.delegatee_id !== delegatee_id) {
      
      // calculate delegator interest
      const interest_delegator = calculateDelegatorInterest(deudaDelegador_onchain);
      // calculate proportion
      let proportion = (delegatee.total_principal + delegatee.acumulated_interest) / delegator.total_debt;
      
      // calculate delegate interest
      const interest_delegatee = ((interest_delegator * proportion)) || 0;
      delegatee.acumulated_interest += interest_delegatee;
  		delegatee.total_debt = delegatee.total_principal + delegatee.acumulated_interest;
      
      delegatee.proportion = proportion;
      const index = delegation.findIndex((i) => i.delegatee_id === delegatee.delegatee_id);
      delegation[index] = delegatee;
    }
    
  })
}

const borrow = (amount, deudaDelegador_onchain, delegatee_id, type = 'borrow') => {
  const findDelegatee = delegation.find((i) => i.delegatee_id === delegatee_id);
  
  // calcular interest delegator
  const interest_delegator = calculateDelegatorInterest(deudaDelegador_onchain);
	console.log('interest_delegator', interest_delegator);
  // calcular proporcion
  let proportion = (findDelegatee.total_principal + findDelegatee.acumulated_interest) / delegator.total_debt;
	console.log('proportion', proportion);
  
  // delegado
  let interest_delegatee = (findDelegatee.acumulated_interest + (interest_delegator * proportion)) || 0;
	console.log('interest_delegatee', interest_delegatee);
  
  // update current delegatee
  findDelegatee.acumulated_interest = interest_delegatee;
  findDelegatee.total_principal += amount;
  findDelegatee.total_debt = findDelegatee.total_principal + interest_delegatee;
  findDelegatee.proportion = proportion || 0;
  const index = delegation.findIndex((i) => i.delegatee_id === delegatee_id);
  delegation[index] = findDelegatee;
  
  // update all delgatees
  update_delegatees_balance(deudaDelegador_onchain, delegatee_id);
  
  // update delegator
  delegator.total_debt =  deudaDelegador_onchain + amount;
  delegator.total_principal += amount;
  deuda_delegator_onchain += amount;
}

const repay = (amount, deudaDelegador_onchain, delegatee_id) => {
  const findDelegatee = delegation.find((i) => i.delegatee_id === delegatee_id);
	let proportion = (findDelegatee.total_principal + findDelegatee.acumulated_interest) / delegator.total_debt;
	console.log('proportion', proportion);
  
  const interest_delegator = calculateDelegatorInterest(deudaDelegador_onchain);
	console.log('interest_delegator', interest_delegator);
  
  // delegado
  let interest_delegatee = (findDelegatee.acumulated_interest + (interest_delegator * proportion)) || 0;
	console.log('interest_delegatee', interest_delegatee);
  
  findDelegatee.acumulated_interest = amount > findDelegatee.total_debt ? 0 : interest_delegatee;
  findDelegatee.total_debt = findDelegatee.total_principal + interest_delegatee - amount;
  findDelegatee.total_principal = amount > findDelegatee.total_principal ? 0 : findDelegatee.total_principal - amount;
  findDelegatee.proportion = amount > findDelegatee.total_debt ? 0 : proportion || 0;
  const index = delegation.findIndex((i) => i.delegatee_id === delegatee_id);
  delegation[index] = findDelegatee;
  
  // update all delgatees
  update_delegatees_balance(deudaDelegador_onchain, delegatee_id);
  
  // update delegator
  delegator.total_debt = deudaDelegador_onchain - amount;
  delegator.total_principal -= amount;
  deuda_delegator_onchain -= amount;
}

// Usuario 1 Borrow 1
borrow(10, deuda_delegator_onchain, 1);

// Usuario 1 Borrow 2
deuda_delegator_onchain += 0.1;
borrow(10, deuda_delegator_onchain, 1);

// Usuario 2 Borrow 1
delegationFt(100, 2, 1);
deuda_delegator_onchain += 0.02;
borrow(10, deuda_delegator_onchain, 2);

// Usuario 2 Borrow 2
deuda_delegator_onchain += 0.02;
borrow(10, deuda_delegator_onchain, 2);

// Usuario 3 Borrow 1
delegationFt(100, 3, 1);
deuda_delegator_onchain += 0.02;
borrow(10, deuda_delegator_onchain, 3);

// Usuario 3 Borrow 2
deuda_delegator_onchain += 0.5;
borrow(10, deuda_delegator_onchain, 3);

// Usuario 3 Borrow 3
deuda_delegator_onchain += 0.5;
borrow(10, deuda_delegator_onchain, 3);

// Usuario 1 Borrow 3
deuda_delegator_onchain += 0.5;
borrow(10, deuda_delegator_onchain, 1);

// Repay Usuario 1
deuda_delegator_onchain += 0.5;
repay(10, deuda_delegator_onchain, 1);


const get_delegate_info = (deudaDelegador_onchain, delegatee_id) => {
  const findDelegatee = delegation.find((i) => i.delegatee_id === delegatee_id);
  const delegatee = { ...findDelegatee };
  let proportion = (delegatee.total_principal + delegatee.acumulated_interest) / delegator.total_debt;
	console.log('proportion', proportion);
  
  const interest_delegator = calculateDelegatorInterest(deudaDelegador_onchain);
	console.log('interest_delegator', interest_delegator);
  // delegado
  let interest_delegatee = (delegatee.acumulated_interest + (interest_delegator * proportion)) || 0;
	console.log('interest_delegatee', interest_delegatee);
  
  delegatee.acumulated_interest = interest_delegatee;
  delegatee.proportion = proportion;
  delegatee.total_debt = delegatee.total_principal +  delegatee.acumulated_interest;
  
  return delegatee;
}

// // repay Usuario 2
deuda_delegator_onchain += 0.5;
const delegatee = get_delegate_info(deuda_delegator_onchain, 1);
console.log('delegatee infooooo =====', delegatee);

console.log('deuda_delegator_onchain', deuda_delegator_onchain);
repay(delegatee.total_debt, deuda_delegator_onchain, 1);


console.log(delegation);
console.log(delegator);

// Borrow Usuario 1



const setFirestoreDelegationData = async (params, chainId) => {
  console.log('params: ', params);
  const { delegator_id, delegatee_id } = params;
  const response = await findDelegatorAndDelegatee(chainId, delegator_id, delegatee_id);
  console.log('response: ', response);

  const { delegatorId, delegatorData } = await getDelegator(chainId, delegator_id);
  console.log('delegatorData: ', delegatorData);
  
  if (response.size <= 0) {
    delegatorData.delegated = Number(delegatorData.delegated.toFixed(6)) + Number(params.amount.toFixed(6));
    params.total_principal = 0;
    params.total_debt = 0;
    params.acumulated_interest = 0;
    params.proportion = 0;
    params.is_active = true;
    await db.collection(DELEGATIONS_DB[chainId]).add(params);
  } else {
    let data = {};
    let docId = null;
    response.forEach(async (doc) => {
      data = doc.data();
      docId = doc.id;
    });
    delegatorData.delegated = delegatorData.delegated - data.amount + params.amount;
    data.amount = Number(params.amount);
    await db.collection(DELEGATIONS_DB[chainId]).doc(docId).update(data);
  }
  console.log('delegatorData: ', delegatorData);
  return db.collection(DELEGATORS_DB[chainId]).doc(delegatorId).update(delegatorData);
}


// get_delegate_info 
// no enviar delegation junto a delegatee despues de conectarme