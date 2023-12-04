import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';

const ShelterDetail = () => {
    const { shelterId } = useParams()

    return (
        <div>
            <h1>Shelter Detail</h1>
            <h1>{shelterId}</h1>
        </div>
    )
}

export default ShelterDetail;