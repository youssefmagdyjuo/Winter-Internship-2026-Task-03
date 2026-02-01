import React from 'react'
import { BeatLoader } from "react-spinners";
export default function Loader() {
    return (
        <div className='loader center'>
            <BeatLoader
                color="#2b4351"
                size={30}
            />
        </div>
    )
}
