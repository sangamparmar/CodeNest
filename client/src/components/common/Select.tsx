import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options: string[]
    title: string
}

function Select({ onChange, value, options, title }: SelectProps) {
    return (
        <div className="relative w-full">
            <label className="mb-2">{title}</label>
            <select
                className="w-full appearance-none rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none"
                value={value}
                onChange={onChange}
                style={{ 
                    // Ensure text is always visible against the background
                    backgroundColor: '#2A2C35',  
                    color: '#FFFFFF'
                }}
            >
                {options.sort().map((option) => {
                    const value = option
                    const name =
                        option.charAt(0).toUpperCase() + option.slice(1)

                    return (
                        <option 
                            key={name} 
                            value={value}
                            style={{
                                backgroundColor: '#2A2C35',
                                color: '#FFFFFF'
                            }}
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
