export function convertChineseNumbers(text: string) {
    const chineseToArabic: any = {
        '一': '1',
        '二': '2',
        '三': '3',
        '四': '4',
        '五': '5',
        '六': '6',
        '七': '7',
        '八': '8',
        '九': '9',

    };

    const excludedCharacters = ['十', '百', '千', '万', '亿'];
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

    // 检查文本是否包含排除字符中的任何一个，不转换
    if (excludedCharacters.some(char => text.includes(char))) {
        return text;
    }
    if (/[一二三四五六七八九]个/.test(text)) {
        return text
    }

    return text.replace(
        /(?<!\d)[一二三四五六七八九](?!\d)/g,
        match => chineseToArabic[match]
    );
}

export default convertChineseNumbers;