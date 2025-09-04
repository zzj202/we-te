export default function debounce(func: Function, wait = 300) {
    let timeoutId: any

    return function (this: any, ...args: any) {
        // 清除之前的定时器
        clearTimeout(timeoutId)

        // 设置新的定时器
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}