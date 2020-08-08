import React, { useState, useEffect } from 'react'

export default function Test() {

    const [testing, setTesting] = useState("")


    async function fetchData() {
        const res = await fetch("http://127.0.0.1:8000/");
        res
            .json()
            .then(res => setTesting(res.message))
    }

    useEffect(() => {
        fetchData();
    });

    return (
        <div>
            Message from backend is: {testing}
        </div>
    )
}
