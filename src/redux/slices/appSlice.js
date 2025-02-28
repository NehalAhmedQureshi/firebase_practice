import { setLogLevel } from "firebase/app"

const { createSlice } = require("@reduxjs/toolkit")


const initialState = {
    user:null,
    loading:false,
}

const appSlice = createSlice({
    name:'app',
    initialState,
    reducers:{
        setUser:(state , action) => {
            state.user = action?.payload //set user value
        },
        setLoading:(state,action)=>{
            if (typeof action.payload === "boolean") {
                state.loading = action.payload;
            } else {
                console.warn("Invalid payload: Expected a boolean");
            }
        }
    }
})

//  export reducer functions
export const {setUser} = appSlice.actions
// export slice
export default appSlice.reducer