export const setUser = (id, name, email, image) => ({
    type : "SET_USER",
    payload : {id, name, email, image}
})

export const setUserNull = () => ({
    type : "SET_USER",
    payload : {}
})