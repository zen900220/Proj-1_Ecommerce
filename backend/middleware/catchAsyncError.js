module.exports = (asyncFunc) => {
  return (req, res, next) => {
    asyncFunc(req, res, next).catch(next);
  };
};

//? CURRIED FUNCTIONS
// A chain of arrow functions is called a curried function.
// a => b => a+b; is same as:
// (a)=>{
//     return (b)=>{
//         return a+b;
//     }
// }
// so (a) returns the func (b) which returns a+b

//? Catching errors in express
//errors in asynchronous code will be handled by passing them to next.
// next(err) --> express handles the err
//catch is passed err automatically. SO passing it next will make it use
//next as callback and do next(err)
