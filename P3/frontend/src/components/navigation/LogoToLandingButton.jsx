import React from "react";

export default function LogoToLandingButton() {
    return (
        <a href="/" className="flex flex-row text-[2rem]">
            <h1 className="pr-[10px] text-[#290005] my-[.2rem]">Pet Pal</h1>
            <object style={{pointerEvents: "none"}} data="/logo.svg" className="my-[.2rem] w-[4rem]" type="image/svg+xml"></object>
        </a>
    )
}