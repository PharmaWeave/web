"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCPF } from "@/utils/cpf"

interface ComboBoxProps<T> {
    label?: string
    items: T[]
    displayKeys: (keyof T)[]
    valueKey: keyof T
    value?: any
    placeholder?: string
    onChange: (v: any) => void
}

export default function ComboBox<T>({
    label,
    items,
    displayKeys,
    valueKey,
    value,
    placeholder = "Selecione...",
    onChange
}: ComboBoxProps<T>) {

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: any) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const showKeys = (selected: T) => {
        let string = ""

        for (let key of displayKeys) {
            if (key.toString().includes("register")) {
                string += formatCPF(selected[key] as string) + " - "
            }
            else string += selected[key] as string + " - "
        }

        return string.slice(0, string.length - 3)
    }

    const selected = items.find(i => i[valueKey] === value)
    const filtered = items.filter(i =>
        displayKeys.map(key =>
            (i[key] as unknown as string)
                .toLowerCase()
                .includes(search.toLowerCase())
        ).reduce((a, b) => a || b, false))

    return (
        <div className="space-y-1 w-full" ref={ref}>
            {label && <span className="text-sm font-medium">{label}</span>}

            <Button
                type="button"
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setOpen(o => !o)}
            >
                {selected ? showKeys(selected) : placeholder}
                <span>▾</span>
            </Button>

            {open && (
                <div className="mt-1 border rounded-md bg-white shadow z-[9999] absolute w-full">
                    <Input
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-none border-b"
                        onKeyDown={e => {
                            if (e.key === "Enter") e.preventDefault()
                        }}
                    />

                    <div className="max-h-48 overflow-auto">
                        {filtered.length === 0 && (
                            <div className="p-2 text-sm text-muted-foreground">
                                Nenhum item encontrado
                            </div>
                        )}

                        {filtered.map((item, idx) => (
                            <div
                                key={idx}
                                className={`px-3 py-2 cursor-pointer hover:bg-muted ${value === item[valueKey] ? "bg-muted/60 font-medium" : ""
                                    }`}
                                onClick={() => {
                                    onChange(item[valueKey])
                                    setOpen(false)
                                }}
                            >
                                {showKeys(item) as any}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
