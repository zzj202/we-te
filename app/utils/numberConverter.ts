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
    const zodiacAnimals = ['龙', '虎', '蛇', '鼠', '兔', '猴', '牛', '马', '羊', '鸡', '狗', '猪'];


    if (text.includes('野肖')) {
        text = text.replace(/野肖/g, '龙虎蛇鼠兔猴');
    }
    if (text.includes('家肖')) {
        text = text.replace(/家肖/g, '牛马羊鸡狗猪');
    }

    // 检查文本是否包含排除字符中的任何一个，不转换
    if (excludedCharacters.some(char => text.includes(char))) {
        return text;
    }
    //这个正则表达式匹配的是：任意一个中文数字（一至九）后面紧跟"个"字
    //如果匹配成功（比如"一个"、"二个"、"三个"等），就直接返回原始文本 text，不进行后续的数字转换
    if (/[一二三四五六七八九]个/.test(text)) {
        return text
    }

    return text.replace(
        /(?<!\d)[一二三四五六七八九](?!\d)/g,
        match => chineseToArabic[match]
    );
}

export default convertChineseNumbers;