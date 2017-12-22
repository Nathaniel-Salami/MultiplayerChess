//Nathaniel Salami && Temitayo Oyelowo

//stores modules used in the canvas.js
module.exports.assignID = function (length) {
  var id;
  if (length % 2 != 0) {
    id = 'WHITE';
  }
  else {
    id = 'BLACK';
  }
  return id;
};
