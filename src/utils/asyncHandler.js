const asyncHandler = (fn) => async (req,res,next) => { // here fn is the controller
    try {
        await fn(req,res,next)
    } catch (error) {
       res.status(error.code || 500).json({
        success: false,
        message: error.message
       })
    }
}
export {asyncHandler}

