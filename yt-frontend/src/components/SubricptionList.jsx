import axios from "axios"
import { useEffect, useState } from "react"


const SubscriptionList = ({ creator }) => {
    // const [creator, setCreator]=useState(null)
    // const [loading,setLoading]=useState(false)

    // const handelFetchCreator=async()=>{
    //     setLoading(true)
    //     try{
    //         const response=await axios.get(`http://localhost:3200/user/getCreatorDetails/${creatorId}`)
    //         if(response.data){
    //             setCreator(response.data.creator);
    //         }
    //     }
    //     catch(error){
    //         console.log("Error occurred while fetching creator for subscription list ",error)
    //     }
    //     finally{
    //         setLoading(false)
    //     }
    // }

    // useEffect(()=>{
    //     fetchSubscription();
    // },[isOpen])
    return (
        <>
            <div className="subscription list flex p-2 items-center gap-2 font-bold">
                <div>
                    <img className="w-10" src={creator.profileImg}>
                    </img>
                </div>
                <p className="">{creator.fullName}</p>
            </div>
        </>
    )
}

export default SubscriptionList;