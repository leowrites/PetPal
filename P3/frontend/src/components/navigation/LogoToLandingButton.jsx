import React from "react";

export function LogoToLandingButton() {
    return (
        <a href="/" className="flex flex-row text-[2rem]">
            <h1 class="pr-[10px] text-[#290005] my-[1.5rem]">Pet Pal</h1>
            <object style={{pointerEvents: "none"}} data="/logo.svg" class="my-[1.5rem]" type="image/svg+xml"></object>
        </a>
    )
}