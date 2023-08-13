// for catching async try catch error
module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch((err) => {
        return res.status(404).send({
          message:"Error"
        })
        });
      }
    };