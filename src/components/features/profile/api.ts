import $api from "@/lib/api"

const getMe = async (phone:string) => {
    try{ 
        const res = await $api.get(`users/${phone}/profile`);
        return res.data.data;
    }catch(err:any){
        throw err;
    }
}





const getHistoryList = async() => {
    try{
        const res = await $api.get('');
        return res.data
    }catch (err) {
        throw err;
    }
}

export {getMe , getHistoryList}