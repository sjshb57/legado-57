@js:
(function() {
    const Config = {
        punctuationsToRemove: '.。,，',
        convertZeroToPreface: false,
        defaultSuffix: '章',
        preserveSuffixes: '卷次'
    };
    var escaped = Config.punctuationsToRemove.replace(/[-\\]\\^[\\/.*+?()|{}$]/g, '\\$&');
    var baseSuffixes = '章节回集卷部篇话讲段';
    var extraSuffixes = '';
    for (var si = 0; si < Config.preserveSuffixes.length; si++) {
        var sch = Config.preserveSuffixes.charAt(si);
        if (baseSuffixes.indexOf(sch) < 0 && extraSuffixes.indexOf(sch) < 0) extraSuffixes += sch;
    }
    var Regex = {
        patterns: {
            chinesePunctuation: /^[：、；？！。…]/,
            chapter: new RegExp('^第(\\d+|[零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([' + baseSuffixes + extraSuffixes + ']?)(.*)'),
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
            var total = 0;
            var temp = 0;
            for (var i = 0; i < chineseNum.length; i++) {
                var val = this.map[chineseNum.charAt(i)];
                if (val === 10 || val === 100 || val === 1000 || val === 10000) {
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
        var bracketBlacklist = /[票更快祝新迎章订架求免]/;
        title = title.replace(/[（(]([^）)]*)[）)]/g, function(_, inner) {
            return bracketBlacklist.test(inner) ? '' : ' (' + inner + ') ';
        });
        title = title.replace(/[（(]([^）)]*)$/, function(_, inner) {
            return bracketBlacklist.test(inner) ? '' : ' (' + inner + ')';
        });
        title = title.replace(/ {2,}/g, ' ').replace(/^ +| +$/g, '');
        var stripped = title.replace(/^[\d.]+/, '').trim();
        if (stripped && title.match(/^\d+\.\d/)) return stripped;
        title = title.replace(Regex.patterns.allPunctuations, '');
        var digitalMatch = title.match(Regex.patterns.digitalChapter);
        if (digitalMatch) {
            var num = digitalMatch[1];
            var cleanedContent = digitalMatch[2].trim();
            return cleanedContent ?
                '第' + num + Config.defaultSuffix + ' ' + cleanedContent :
                '第' + num + Config.defaultSuffix;
        }
        if (title.charAt(0) !== '第') {
            return title;
        }
        var match = title.match(Regex.patterns.chapter);
        if (!match) return title;
        var chineseNum = match[1];
        var originalSuffix = match[2];
        var titlePart = match[3] || '';
        if (!originalSuffix && /^[季年月日周天期次]/.test(titlePart.replace(/^\s+/, ''))) {
            return title;
        }
        var suffix = (originalSuffix && Config.preserveSuffixes.indexOf(originalSuffix) >= 0) ?
            originalSuffix :
            Config.defaultSuffix;
        var cleanTitlePart = titlePart.trim();
        var number = /^\d+$/.test(chineseNum) ? chineseNum : NumberConverter.convert(chineseNum);
        if (number === 0 && Config.convertZeroToPreface) {
            number = '';
            suffix = '序' + suffix;
        }
        if (cleanTitlePart) {
            var shouldAddSpace = !Regex.patterns.chinesePunctuation.test(cleanTitlePart);
            return '第' + number + suffix + (shouldAddSpace ? ' ' : '') + cleanTitlePart;
        }
        return '第' + number + suffix;
    }
    return processTitle(result);
})();
