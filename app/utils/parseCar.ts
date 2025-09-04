// utils/parseCar.ts
import type { CarRecord } from "~/types/car"
export function parseCarRecords(text: string): CarRecord[] {
    const records: CarRecord[] = []
    const lines = text.split('\n')

    let currentRecord: Partial<CarRecord> = {}
    let currentNumbers: number[] = []

    for (const line of lines) {
        const trimmedLine = line.trim()

        if (trimmedLine.startsWith('六合彩开奖记录')) {
            // 保存上一个记录（如果有）
            if (currentRecord.date && currentNumbers.length > 0) {
                records.push({
                    date: currentRecord.date,
                    issue: currentRecord.issue || '',
                    numbers: [...currentNumbers]
                })
                currentNumbers = []
            }

            // 解析新记录的日期和期号
            const match = trimmedLine.match(/六合彩开奖记录 (\d{4}年\d{1,2}月\d{1,2}日) 第(\d+)期/)
            if (match) {
                currentRecord = {
                    date: match[1],
                    issue: match[2]
                }
            }
        } else if (trimmedLine.match(/^\d{1,2}$/)) {
            // 如果是数字行
            currentNumbers.push(parseInt(trimmedLine, 10))
        }
    }

    // 添加最后一个记录
    if (currentRecord.date && currentNumbers.length > 0) {
        records.push({
            date: currentRecord.date,
            issue: currentRecord.issue || '',
            numbers: [...currentNumbers]
        })
    }

    return records
}