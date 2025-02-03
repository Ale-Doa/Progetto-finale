const isPremium = (membershipType) => {
    const premiumMemberships = ['premium1', 'premium3', 'premium6', 'premium12'];
    return premiumMemberships.includes(membershipType);
  };
  
  module.exports = { isPremium };