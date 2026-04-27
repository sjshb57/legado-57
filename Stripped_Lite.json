@js:
(function() {
    const Config = {
        punctuationsToRemove: '.。,，、',
        convertZeroToPreface: false,
        defaultSuffix: '章',
        preserveSuffixes: '卷次'
    };

    const escaped = Config.punctuationsToRemove.replace(/[-\]\\^]/g, '\\$&');
    const Regex = {
        patterns: {
            chinesePunctuation: /^[：、，；？！（）「」【】]/,
            chapter: /^第(\d+|[零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([章节回集卷部篇话讲段]?)(.*)/,
            digitalChapter: /^(\d+)\s*(.*)/,
            allPunctuations: new RegExp('[' + escaped + ']', 'g'),
            leadingPunctuations: new RegExp('^[\\s' + escaped + ']+')
        }
    };

    const NumberConverter = {
        map: {
            '零': 0,
            '〇': 0,
            '一': 1,
            '二': 2,
            '两': 2,
            '三': 3,
            '四': 4,
            '五': 5,
            '六': 6,
            '七': 7,
            '八': 8,
            '九': 9,
            '十': 10,
            '百': 100,
            '千': 1000,
            '万': 10000,
            '壹': 1,
            '贰': 2,
            '叁': 3,
            '肆': 4,
            '伍': 5,
            '陆': 6,
            '柒': 7,
            '捌': 8,
            '玖': 9,
            '拾': 10,
            '佰': 100,
            '仟': 1000,
            '萬': 10000,
            '貳': 2,
            '參': 3,
            '陸': 6
        },

        convert: function(chineseNum) {
            let total = 0;
            let temp = 0;

            for (let i = 0; i < chineseNum.length; i++) {
                const val = this.map[chineseNum[i]];
                if ([10, 100, 1000, 10000].includes(val)) {
                    temp = (temp === 0 ? 1 : temp) * val;
                    total += temp;
                    temp = 0;
                } else if (val !== undefined) {
                    temp += val;
                }
            }

            return total + temp;
        }
    };

    function processTitle(title) {
        const bracketBlacklist = /[票更快祝新迎章订架求免]/;
        title = title.replace(/[（(]([^）)]*)[）)]|[（(]([^）)]*)$/g, (_, closed, open) => {
            const inner = closed ?? open;
            return bracketBlacklist.test(inner) ? '' : ' (' + inner + ')';
        });
        const stripped = title.replace(/^[\d.]+/, '').trim();
        if (stripped && title.match(/^\d+\.\d/)) return stripped;

        title = title.replace(Regex.patterns.allPunctuations, '');

        const digitalMatch = title.match(Regex.patterns.digitalChapter);
        if (digitalMatch) {
            const [, num, content] = digitalMatch;
            const cleanedContent = content.trim();
            return cleanedContent ?
                `第${num}${Config.defaultSuffix} ${cleanedContent}` :
                `第${num}${Config.defaultSuffix}`;
        }

        if (!title.startsWith('第')) {
            return title;
        }

        const match = title.match(Regex.patterns.chapter);
        if (!match) return title;

        const [, chineseNum, originalSuffix, titlePart] = match;

        if (!originalSuffix && /^[季年月日周天期次]/.test((titlePart || '').trimStart())) {
            return title;
        }

        let suffix = (originalSuffix && Config.preserveSuffixes.includes(originalSuffix)) ?
            originalSuffix :
            Config.defaultSuffix;

        const cleanTitlePart = (titlePart || '').trim();

        let number = /^\d+$/.test(chineseNum) ? chineseNum : NumberConverter.convert(chineseNum);

        if (number === 0 && Config.convertZeroToPreface) {
            number = '';
            suffix = '序' + suffix;
        }

        if (cleanTitlePart) {
            const shouldAddSpace = !Regex.patterns.chinesePunctuation.test(cleanTitlePart);
            return `第${number}${suffix}${shouldAddSpace ? ' ' : ''}${cleanTitlePart}`;
        }

        return `第${number}${suffix}`;
    }

    return processTitle(result);
})();
