const validation = (schema) => async (req,res,next) => {
    try{
        req.body = await schema.validateAsync(req.body);
        return next()
    }catch(err){
        console.log(err);
        res.send({err:'Invalid inputs'});
    }
};

module.exports = validation
