const onlyNumber = (value: any) => {
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
        return true
    }
    return false
}

const numberFormat = (value: number) => {
    return new Intl.NumberFormat('en', { maximumFractionDigits: 18 }).format(value);
}

export {onlyNumber, numberFormat}