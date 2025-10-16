

const dataMethods = ['body', 'params', 'query', 'headers', 'file', 'files']

export const validationService = (schema) => {
    return (req, res, next) => {
        const validationResult = []
        dataMethods.forEach(key => {
            if(schema[key]){
                const result = schema[key].validate(req[key], {abortEarly: false})
                if (result?.error?.details) {
                    validationResult.push(result.error.details);
                }
            }
        });

        if(validationResult.length){
            return res.send({message: 'Validation Result', validationResult})
        }
        next()
    }
}