

export const  findOne=async({model,filter={},select="",populate=[]}={})=>{
return await model.findOne(filter).select(select).populate(populate)
}

export const  findById=async({model,id,select="",populate=[]}={})=>{
return await model.findById(id).select(select).populate(populate)
}
export const find = async ({ model, filter = {}, select = "", sort = { createdAt: -1 }, populate = [], limit = 0, skip = 0 } = {}) => {
    return await model
        .find(filter)
        .select(select)
        .sort(sort)
        .populate(populate)
        .limit(limit)
        .skip(skip);
};
export const create = async ({ model, data = {}, options = {} }) => {
    const doc = new model(data);
    await doc.save(options); 
    return doc;
};
export const updateOne = async ({ model, filter = {}, data = {}, options = {runValidators:true} }={} ) => {
    
    return await model.updateOne(filter,data,options);
};
export const findOneAndUpdate = async ({ model, filter = {}, data = {},select="",populate=[], options = {runValidators:true,new:true }}={} ) => {
    
    return await model.findOneAndUpdate(filter,data,{...options,select,populate});
};
export const deleteOne = async ({ model, filter = {}, options = {} }={} ) => {
    
    return await model.deleteOne(filter,options);
};