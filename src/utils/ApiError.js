class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went Wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

    if (stack) {  // advanced production grade code,not mandatory to understand right now
        this.stack = stack
    }else{
        Error.captureStackTrace(this,
            this.constructor)
    }
    }
}

export {ApiError}