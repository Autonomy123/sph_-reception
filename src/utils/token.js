//对外暴露token
export const setToken=(token)=>{//存储token
    localStorage.setItem('TOKEN',token)
};
export const getToken=()=>{//获取token
    return localStorage.getItem('TOKEN')
};
export const removeToken=()=>{//清空token
    localStorage.removeItem("TOKEN")
}