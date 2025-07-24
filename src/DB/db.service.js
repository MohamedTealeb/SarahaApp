

export const  findOne=async({model,filter={},select="",populate=[]}={})=>{
return await model.findOne(filter).select(select).populate(populate)
}
export const create = async ({ model, data = {}, options = {} }) => {
    const doc = new model(data);
    await doc.save(options); // يتم التحقق الكامل من الـ schema هنا
    return doc;
};
