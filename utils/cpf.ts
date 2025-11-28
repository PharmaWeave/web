export const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "")

    const part1 = numbers.slice(0, 3)
    const part2 = numbers.slice(3, 6)
    const part3 = numbers.slice(6, 9)
    const part4 = numbers.slice(9, 11)

    let formatted = part1
    if (part2) formatted += "." + part2
    if (part3) formatted += "." + part3
    if (part4) formatted += "-" + part4

    return formatted
}

export const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, "")

    const part1 = numbers.slice(0, 2)
    const part2 = numbers.slice(2, 5)
    const part3 = numbers.slice(5, 8)
    const part4 = numbers.slice(8, 12)
    const part5 = numbers.slice(12, 14)

    let formatted = part1
    if (part2) formatted += "." + part2
    if (part3) formatted += "." + part3
    if (part4) formatted += "/" + part4
    if (part5) formatted += "-" + part5

    return formatted
}

export const formatCPFOrCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")

    if (numbers.length <= 11) return formatCPF(numbers)
    return formatCNPJ(numbers)
}
