class ApiError extends Error {
    constructor(
        statuscode,
        message = "Somethis went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export { ApiError }