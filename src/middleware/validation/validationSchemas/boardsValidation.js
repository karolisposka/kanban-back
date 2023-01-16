const { string } = require('joi');
const joi = require('joi');


const boardAddValidation = joi.object({
    name: joi.string().required(),
    columns: joi.array().items(joi.object().keys({
        id: joi.string().required(),
        name: joi.string().required(),
        tasks: joi.array().required(),
    })).required()
});

const boardUpdate = joi.object({
    page: joi.string().required(),
    object: joi.object().keys({
        _id: joi.string().required(),
        user_id: joi.string().required(),
        name: joi.string().required(),
        columns: joi.array().items(joi.object().keys({
            id: joi.string().required(),
            name: joi.string().required(),
            tasks: joi.array().required(),
        }))
    })
})

const addTask = joi.object({
    page: joi.string().required(),
    object: joi.object().keys({
        id: joi.string().required(),
        description: joi.string().required(),
        name: joi.string().required(),
        status: joi.string().required(),
        subtasks: joi.array().items(joi.object().keys({
            id: joi.string().required(),
            title: joi.string().required(),
            isCompleted: joi.boolean().required(),
        }))
    })
})

const updateTask = joi.object({
    object: joi.object().keys({
        status: joi.string().required(),
        page: joi.string().required(),
        column: joi.string().required(),
        task: joi.string().required()
    })
})

const updateSubtask = joi.object({
    id: joi.string().required(),
    status: joi.boolean().required(),
    page: joi.string(),
    column: joi.string().required(),
    task: joi.string().required()
})




module.exports = { boardAddValidation, boardUpdate, addTask, updateTask, updateSubtask }