// stores/main.ts
import { defineStore } from 'pinia'

import type { BetLine } from '@/types/game'

export const useMainStore = defineStore('main', {
    state: () => ({
        addBetString: '' as string,
        addBetLines: [] as BetLine[],
        userBrowser:'' as String
    }),

    getters: {
        isAllValid(): boolean {
            if (this.addBetLines.length === 0) return false
            return this.addBetLines.every(line => line.isValid)
        },

    },

    actions: {
        //解析addBetString
        handleAddBetString() {
            this.addBetLines = []
            const lines = this.addBetString.split('\n').filter(line => line.trim())
            lines.forEach((line, index) => {
                this.addBetLines.push({
                    index: index + 1, // 从1开始编号
                    isValid: false, //合格
                    inputValue: convertChineseNumbers(line),
                    amount: 0,  //金额
                    totalAmount: 0,//总金额
                    type: '',
                    description: '',
                    selectedNumbers: [], //选择的号码
                })
            })
        },
        // 获取指定序号的投注行
        getAddBetLine(index: number): BetLine | undefined {
            return this.addBetLines.find(line => line.index === index)
        },
        getLineInputValue(index: number): string {
            const line = this.getAddBetLine(index) as BetLine
            return line.inputValue
        },
        // 设置指定投注行为不合格
        setBetLineInvalid(index: number) {
            const line = this.getAddBetLine(index) as BetLine
            line.isValid = false
        },
        //设置合格
        setBetLineValid(index: number, clearReason: boolean = true) {
            const line = this.getAddBetLine(index) as BetLine
            // 如果已经是合格状态，无需处理
            if (line.isValid) {
                return
            }
            line.isValid = true
        },
        setSelectNumbers(index: number, selectedNumbers: []) {
            const line = this.getAddBetLine(index) as BetLine
            line.selectedNumbers = selectedNumbers
        },
        setAmount(index: number, amount: number) {
            const line = this.getAddBetLine(index) as BetLine
            line.amount = amount
            line.totalAmount = amount * line.selectedNumbers.length
        },

        setType(index: number, type: string) {
            const line = this.getAddBetLine(index) as BetLine
            line.type = type
        },
        setDescription(index: number, description: string) {
            const line = this.getAddBetLine(index) as BetLine
            line.description = description
        },
        setInputValue(index: number, value: string) {
            const line = this.getAddBetLine(index) as BetLine
            line.inputValue = value
        },
        // 更新投注行并同步更新addBetString
        updateBetLine(index: number, inputValue: string) {
            const line = this.getAddBetLine(index) as BetLine
            line.inputValue = inputValue

            // 更新addBetString
            const lines = [...this.addBetLines]
            const targetIndex = lines.findIndex(l => l.index === index) as number
            if (targetIndex !== -1 && lines[targetIndex]) {
                lines[targetIndex].inputValue = inputValue
                this.addBetString = lines.map(l => l.inputValue).join('\n')
            }
        },
        isValid(index: number) {
            return this.addBetLines.find(line => line.index === index)?.isValid
        },
        isCanConfirm(): { canConfirm: boolean; invalidIndexes: number[] } {

            // if (!this.addBetLines || this.addBetLines.length == 0) {
            //     return {
            //         canConfirm: false,
            //         invalidIndexes: [],
            //     };
            // }
            const invalidIndexes: number[] = [];
            this.addBetLines.forEach((betLine, index) => {
                if (
                    !betLine.isValid
                ) {
                    invalidIndexes.push(index + 1);
                }
            });
            return {
                canConfirm: invalidIndexes.length === 0,
                invalidIndexes,
            };
        },
        reset() {
            this.addBetString = ''
            this.addBetLines = []
        },

        setUserBroswer(broswer:string){
            this.userBrowser=broswer
        }
    }
})