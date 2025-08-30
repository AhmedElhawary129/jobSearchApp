export const create = async({model, query = {}} = {}) => {
    return await model.create(query);
}

export const findOne = async({model, filter = {}, populate = [], skip = 0, limit = 100, select = ""} = {}) => {
    return await model.findOne(filter).populate(populate).skip(skip).limit(limit).select(select);
}

export const findById = async({model, filter = {}, populate = [], skip = 0, limit = 100} = {}) => {
    return await model.findOne(filter).populate(populate).skip(skip).limit(limit);
}

export const find = async({model, filter = {}, populate = [], skip = 0, limit = 100, select = ""} = {}) => {
    return await model.find(filter).populate(populate).skip(skip).limit(limit).select(select);
}


export const updateOne = async({model, filter = {}, update = {}} = {}) => {
    return await model.updateOne(filter, update);
}


export const deleteOne = async({model, filter = {}} = {}) => {
    return await model.deleteOne(filter, update);
}


export const deleteMany = async({model, filter = {}} = {}) => {
    return await model.deleteMany(filter, update);
}


export const findOneAndDelete = async({model, filter = {}, options = {new : true}} = {}) => {
    return await model.findOneAndDelete(filter, options);
}

export const findOneAndUpdate = async({model, filter = {}, update = {}, options = {new : true}, populate = [], select = ""} = {}) => {
    return await model.findOneAndUpdate(filter, update, options).populate(populate).select(select);
}


export const findByIdAndUpdate = async({model, filter = {}, update = {}, options = {new : true}, populate = [], select = ""} = {}) => {
    return await model.findOneAndUpdate(filter, update, options).populate(populate).select(select);
}