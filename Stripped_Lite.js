@js:
(function() {
    const Config = {
        punctuationsToRemove: '.。,，、',
        convertZeroToPreface: false,
        defaultSuffix: '章',
        preserveSuffixes: '卷次'
    };

    var escaped = Config.punctuationsToRemove.replace(/[-\]\\\^[\/.*+?()|{}$]/g, '\\$&');
    var baseSuffixes = '章节回集卷部篇话讲段';
    var extraSuffixes = '';
    for (var si = 0; si < Config.preserveSuffixes.length; si++) {
        var sch = Config.preserveSuffixes.charAt(si);
        var schEscaped = sch.replace(/[-\]\\\^[\/.*+?()|{}$]/g, '\\$&');
        if (baseSuffixes.indexOf(sch) < 0 && extraSuffixes.indexOf(sch) < 0) extraSuffixes += schEscaped;
    }
    var allSuffixes = baseSuffixes + extraSuffixes;
    var timeUnitsBase = '季年月日周天期';
    var timeUnits = '';
    for (var ti = 0; ti < timeUnitsBase.length; ti++) {
        var tch = timeUnitsBase.charAt(ti);
        if (allSuffixes.indexOf(tch) < 0) timeUnits += tch;
    }
    var Regex = {
        patterns: {
            chapter: new RegExp('^第(\\d+|[零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([' + allSuffixes + ']?)(.*)'),
            digitalChapterWithSuffix: new RegExp('^(\\d+)([' + allSuffixes + '])(.*)'),
            digitalChapter: /^(\d+)\s*(.*)/,
            digitalTimeUnit: timeUnits ? new RegExp('^\\d+[' + timeUnits + ']') : null,
            chinesePunctuation: /^[：、；？！。…]/,
            leadingPunctuations: new RegExp('^[\\s' + escaped + ']+'),
            trailingPunctuations: new RegExp('[\\s' + escaped + ']+$'),
            allPunctuations: new RegExp('[' + escaped + ']', 'g')
        }
    };

    var halfToFull = {
        ':': '：',
        '!': '！',
        '?': '？',
        ',': '，',
        ';': '；'
    };

    var NumberConverter = {
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

    function assemble(prefix, suffix, titlePart) {
        var hadSpace = /^\s/.test(titlePart);
        var cleanPart = titlePart
            .replace(Regex.patterns.leadingPunctuations, '')
            .replace(Regex.patterns.trailingPunctuations, '');
        if (!cleanPart) return prefix + suffix;
        var firstChar = cleanPart.charAt(0);
        if (halfToFull[firstChar]) {
            return prefix + suffix + halfToFull[firstChar] + cleanPart.slice(1).replace(/^\s+/, '');
        } else if (Regex.patterns.chinesePunctuation.test(firstChar)) {
            return prefix + suffix + cleanPart;
        } else if (hadSpace || /[\u4e00-\u9fff\w]/.test(firstChar)) {
            return prefix + suffix + ' ' + cleanPart;
        } else {
            return prefix + suffix + cleanPart;
        }
    }

    function processTitle(title) {
        var bracketBlacklist = /[票更快祝新迎章订架求免]/;
        title = title.replace(/[（(]([^）)]*)[）)]/g, function(_, inner) {
            return bracketBlacklist.test(inner) ? '' : ' (' + inner + ') ';
        });
        title = title.replace(/[（(]([^）)]*)$/, function(_, inner) {
            return bracketBlacklist.test(inner) ? '' : ' (' + inner + ')';
        });
        title = title.replace(/ {2,}/g, ' ').replace(/^ +| +$/g, '');

        if (/^\d+\.\d/.test(title)) {
            var stripped = title.replace(/^[\d.]+/, '').replace(/^\s+|\s+$/g, '');

            return stripped ? stripped.replace(Regex.patterns.allPunctuations, '') : title;
        }

        var cleaned = title.replace(Regex.patterns.allPunctuations, '');

        var suffixMatch = title.match(Regex.patterns.digitalChapterWithSuffix);
        if (suffixMatch) {
            var sNum = suffixMatch[1];
            var sOrigSuffix = suffixMatch[2];
            var sTitlePart = suffixMatch[3] || '';
            var sSuffix = (Config.preserveSuffixes.indexOf(sOrigSuffix) >= 0) ?
                sOrigSuffix : Config.defaultSuffix;
            return assemble('第' + sNum, sSuffix, sTitlePart);
        }

        if (Regex.patterns.digitalTimeUnit && Regex.patterns.digitalTimeUnit.test(title)) {
            return cleaned;
        }
        var digitalMatch = title.match(Regex.patterns.digitalChapter);
        if (digitalMatch) {
            return assemble('第' + digitalMatch[1], Config.defaultSuffix, digitalMatch[2]);
        }

        if (title.charAt(0) !== '第') return cleaned;

        var match = title.match(Regex.patterns.chapter);
        if (!match) return cleaned;

        var chineseNum = match[1];
        var originalSuffix = match[2];
        var titlePart = match[3] || '';

        if (!originalSuffix && /^[季年月日周天期次]/.test(titlePart.replace(/^\s+/, ''))) {
            return cleaned;
        }

        var suffix = (originalSuffix && Config.preserveSuffixes.indexOf(originalSuffix) >= 0) ?
            originalSuffix : Config.defaultSuffix;

        var number = /^\d+$/.test(chineseNum) ? chineseNum : NumberConverter.convert(chineseNum);

        if (Number(number) === 0 && Config.convertZeroToPreface) {
            number = '';
            suffix = '序' + suffix;
        }
        return assemble('第' + number, suffix, titlePart);
    }

    return processTitle(result);
})();