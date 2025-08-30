export const pagination = async ({page = 1, model, populate = [], filter = {}, sort = {}, select = ""} = {}) => {
    let _page = page * 1 || 1;
    if (_page < 1) {
        _page = 1
    }
    let limit = 2
    let skip = (_page - 1) * limit
    const data = await model.find(filter).limit(limit).skip(skip).populate(populate).sort(sort).select(select)
    return {data, _page}
}