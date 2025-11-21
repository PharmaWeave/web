const formatCPF = (numbers: string): string => {
    const s = numbers.replace(/\D/g, '');
    if (s.length !== 11) return numbers;
    return s.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default formatCPF