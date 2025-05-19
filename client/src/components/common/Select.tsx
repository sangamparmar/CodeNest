import React from "react";
import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import "@/styles/sidebar-styles.css"

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options: string[]
    title: string
}

function Select({ onChange, value, options, title }: SelectProps) {
    return (        <div className="relative w-full">
            <label className="mb-2 sidebar-label">{title}</label><select
                className="w-full rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none sidebar-select"
                value={value}
                onChange={onChange}
            >{options.sort().map((option) => {
                    const value = option
                    const name =
                        option.charAt(0).toUpperCase() + option.slice(1)

                    return (
                        <option 
                            key={name} 
                            value={value}
                            className="bg-dark text-white"
                        >
                            {name}
                        </option>
                    )
                })}
            </select>
            <PiCaretDownBold
                size={16}
                className="absolute bottom-3 right-4 z-10 text-white"
            />
        </div>
    )
}

export default Select
