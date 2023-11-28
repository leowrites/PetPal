import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PetApplication from './PetApplication'

// similar to PetApplication but fields are not editable
export default function CompletedPetApplication() {
    return (
        <PetApplication completed={true}/>
    )
}