import axios from "axios"
import { useEffect, useState } from "react"


const SubscriptionList = ({ creator }) => {
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