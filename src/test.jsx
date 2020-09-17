import React, { useState, useEffect } from 'react'

export default function Test() {

    const [testing, setTesting] = useState("")


    async function fetchData() {
        const res = await fetch(process.env.REACT_APP_API_URL + "test");
        res
            .json()
            .then(res => setTesting(res.message))
    }

    useEffect(() => {
        fetchData();
    });

    return (
        <>
            {console.log(process.env.REACT_APP_API_URL)}
            <div>
                Message from backend is: {testing}
            </div>
        </>

    )
}
