export const GLOBALTYPES = {
    AUTH: "AUTH",
    LOGOUT: "LOGOUT",
    ALERT: "ALERT",
    THEME: 'THEME',
    STATUS: 'STATUS',
    MODAL: 'MODAL',
    SOCKET: 'SOCKET',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    CALL: 'CALL',
    PEER: 'PEER',
    ERROR: 'ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
}

export const EditData = (data, id, post) => {
    const newData = data.map(item => 
        (item._id === id ? post : item)
    )

    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData;
}