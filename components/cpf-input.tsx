"use client"

import { Input } from "@/components/ui/input"

interface CPFInputProps<T> {
    setForm: React.Dispatch<React.SetStateAction<T>>;
    form: {
        register: string;
    } & T
}

export default function CPFInput<T>(props: CPFInputProps<T>) {
    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target
        const selectionStart = input.selectionStart || 0

        let numbers = input.value.replace(/\D/g, "")

        let formatted = ""
        const part1 = numbers.slice(0, 3)
        const part2 = numbers.slice(3, 6)
        const part3 = numbers.slice(6, 9)
        const part4 = numbers.slice(9, 11)

        formatted = part1
        if (part2) formatted += "." + part2
        if (part3) formatted += "." + part3
        if (part4) formatted += "-" + part4

        props.setForm(prev => ({ ...prev, register: formatted }))

        const diff = formatted.length - input.value.length
        const newPos = selectionStart + diff
        setTimeout(() => {
            input.setSelectionRange(newPos, newPos)
        }, 0)
    }

    return (
        <Input
            id="register"
            type="text"
            value={props.form.register}
            onChange={handleCPFChange}
            maxLength={14}
            className="bg-input border-border text-foreground"
            placeholder="111.111.111-11"
            required
        />
    )
}