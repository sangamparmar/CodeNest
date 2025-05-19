import { useRunCode } from "@/context/RunCodeContext.tsx"
import useResponsive from "@/hooks/useResponsive.tsx"
import React from "react"
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast"
import { LuCopy, LuPlay, LuCode, LuTerminal, LuInfo } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"

function RunView() {
    const { viewHeight } = useResponsive()
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()
    const [inputText, setInputText] = useState("")
    const [showInputHelp, setShowInputHelp] = useState(false)

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = JSON.parse(e.target.value)
        setSelectedLanguage(lang)
    }

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setInputText(value)
        setInput(value)
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toast.success("Output copied to clipboard")
    }

    return (
        <div
            className="flex flex-col items-center gap-3 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title flex items-center gap-2">
                <LuCode size={20} className="text-primary" /> Run Code
            </h1>
            <div className="flex h-[90%] w-full flex-col items-end gap-3 md:h-[92%]">
                {/* Language Selector with improved styling */}
                <div className="relative w-full">
                    <label className="mb-1 block text-sm font-medium text-gray-300">
                        Select Language
                    </label>
                    <div className="relative rounded-md border border-gray-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                        <select
                            className="w-full appearance-none rounded-md border-none bg-gray-800 px-4 py-2.5 text-white outline-none"
                            value={JSON.stringify(selectedLanguage)}
                            onChange={handleLanguageChange}
                        >
                            {supportedLanguages
                                .sort((a, b) => (a.language > b.language ? 1 : -1))
                                .map((lang, i) => {
                                    return (
                                        <option
                                            key={i}
                                            value={JSON.stringify(lang)}
                                        >
                                            {lang.language +
                                                (lang.version
                                                    ? ` (${lang.version})`
                                                    : "")}
                                        </option>
                                    )
                                })}
                        </select>
                        <PiCaretDownBold
                            size={16}
                            className="absolute bottom-3 right-4 z-10 text-primary"
                        />
                    </div>
                </div>

                {/* Input area with improved styling and input guidance */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-300">
                            Input
                        </label>
                        <button 
                            onClick={() => setShowInputHelp(!showInputHelp)}
                            type="button"
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors duration-200"
                            title="See input format help"
                        >
                            <LuInfo size={14} />
                            Input Help
                        </button>
                    </div>
                    
                    {/* Input help panel with examples */}
                    {showInputHelp && (
                        <div className="mb-2 p-3 bg-gray-800/50 border border-gray-700 rounded-md text-xs text-gray-300">
                            <p className="mb-2 font-medium text-primary">How to provide multiple inputs:</p>
                            <ul className="list-disc pl-4 space-y-1.5">
                                <li>Enter each input on a <span className="text-white font-medium">separate line</span></li>
                                <li>Example for inputs <span className="text-white font-medium">3</span> and <span className="text-white font-medium">4</span>:
                                    <div className="mt-1 p-2 bg-gray-900 rounded border border-gray-700 font-mono">
                                        3<br/>4
                                    </div>
                                </li>
                                <li>For array input like <span className="text-white font-medium">[1,2,3]</span>, enter on a single line:
                                    <div className="mt-1 p-2 bg-gray-900 rounded border border-gray-700 font-mono">
                                        [1,2,3]
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                    
                    <div className="rounded-md border border-gray-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                        <textarea
                            className="min-h-[120px] w-full resize-none rounded-md border-none bg-gray-800 p-3 text-white outline-none placeholder:text-gray-500"
                            placeholder="Enter your input here...
For multiple inputs like 3 and 4, enter each on a new line:
3
4"
                            onChange={handleInputChange}
                            value={inputText}
                        />
                    </div>
                    
                    {/* Visual input format example always shown */}
                    <div className="mt-1.5 text-xs text-gray-400 flex items-start gap-1">
                        <LuInfo size={12} className="mt-0.5 text-primary" />
                        <span>For multiple inputs, enter each value on a new line</span>
                    </div>
                </div>

                {/* Run button with improved styling and animation */}
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary p-2.5 font-bold text-black transition-all duration-200 hover:bg-primary/90 hover:shadow-md outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={runCode}
                    disabled={isRunning}
                >
                    {isRunning ? 'Running...' : (
                        <>
                            <LuPlay size={18} className="animate-pulse" />
                            Run
                        </>
                    )}
                </button>

                {/* Output section with improved styling */}
                <div className="w-full">
                    <div className="mb-1 flex w-full justify-between items-center">
                        <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
                            <LuTerminal size={16} className="text-primary" /> Output
                        </label>
                        <button 
                            onClick={copyOutput} 
                            title="Copy Output"
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <LuCopy size={14} />
                            Copy
                        </button>
                    </div>
                    <div className="w-full flex-grow overflow-y-auto rounded-md border border-gray-700 bg-gray-900 p-3 font-mono text-gray-100 shadow-inner">
                        <code>
                            <pre className="text-wrap whitespace-pre-wrap">{output || "Output will appear here..."}</pre>
                        </code>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RunView
