var newCheckAccountOrder = require('./new_check_account_order');
var generateCoupon = require('./generateCoupon');

function runBoth() {
  newCheckAccountOrder().then(function() {
    return generateCoupon();
  });
}

runBoth();
