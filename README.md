# #01 数字标题#JS

[![Channel](https://img.shields.io/badge/Telegram-Channel-blue?style=flat-square&logo=telegram)](https://t.me/sjshb_2157)

### *作者：sjshb57

## // ==== 1. 功能文档 ====

- 功能概述：

- 本脚本是一个高级中文数字标题转换工具，专门用于处理各种格式的中文数字标题，将其转换为统一的阿拉伯数字格式，同时提供多种智能处理选项。

#### 主要功能亮点：

```
1. 全面支持简繁体中文数字转换（零-萬）
2. 智能空格处理（自动补全章节号与内容间的空格，全角空格统一转半角，章节号与标题间半角标点自动转全角，中文标点前不补空格）
3. 标点符号清理（章节标题只清衔接处与末尾，标题内标点原样保留；非章节标题全文删除）
4. 特殊章节处理（『第零章』→『序章』）
5. 纯数字标题转换（『1 内容』→『第1章 内容』）
6. 数字+标识符标题转换（『29章 标题』→『第29章 标题』）
7. 前缀序号剥离（『1. 章节名 标题』→『章节名 标题』、『8.29 请假条』→『请假条』；『4月抽奖活动』等数字紧邻时间词不替换）
8. 无标识符标题兼容（『第一百标题』→『第100章 标题』）
9. 多章节标识符适配与白名单保护（章/节/回/集等，白名单内标识符不被覆盖）
10. 括号内容清理（非黑名单内容保留并转为半角格式，黑名单内容整体删除）
```

#### 典型输入输出示例（七大类）：

- 输入 → 输出

**基础数字转换**

```
『第一章 内容』         → 『第1章 内容』
『第壹佰贰拾叁节』      → 『第123章』（『节』不在白名单，被 defaultSuffix 覆盖）
『第伍萬陆仟柒佰捌拾篇』→ 『第56780章』（同上）
『第贰拾卷』            → 『第20卷』（『卷』在白名单，原样保留）
```

**零值与特殊格式**

```
『第零回 内容』 → 『序章 内容』（convertZeroToPreface=true 时；『回』已被 defaultSuffix 覆盖）
『第〇章 空白』 → 『第0章 空白』（convertZeroToPreface=false 时）
『第一章 标题』 → 『第1篇 标题』（defaultSuffix='篇'，强制覆盖）
```

**空格与标点规范**

```
『第1章内容』   → 『第1章 内容』（无分隔时自动补半角空格）
『第1章　内容』 → 『第1章 内容』（全角空格转半角）
『第1章：简介』 → 『第1章：简介』（全角标点原样拼接，不补空格）
『第1章 ：简介』→ 『第1章：简介』（中文标点前的空格不保留）
『第1章:简介』  → 『第1章：简介』（半角标点自动转全角）
『第1章 内容。』→ 『第1章 内容』（末尾标点清理）
『第1章，内容』 → 『第1章 内容』（衔接处标点清理）
『第5章 你好，世界』→ 『第5章 你好，世界』（标题内标点原样保留）
『第319章 ：“不，我们还有另一条路。”』→ 『第319章：“不，我们还有另一条路。”』
『请，假。』    → 『请假』（非章节标题仍全文删除指定标点）
```

**数字+标识符标题**

```
『29章 标题』  → 『第29章 标题』
『29章　标题』 → 『第29章 标题』（全角空格转半角）
『29章：标题』 → 『第29章：标题』（全角标点原样保留）
『29次 测试』  → 『第29次 测试』（次在白名单，保留标识符）
```

**纯数字标题处理**

```
『123』     → 『第123章』
『456内容』 → 『第456章 内容』
『01 测试』 → 『第01章 测试』
```

**前缀序号剥离**（数字后紧跟『.』视为前缀序号：列表序号 / 日期 / 编号）

```
『1. 章节名 标题』→ 『章节名 标题』（列表序号）
『3.测试』       → 『测试』（点后无空格同样视为序号）
『8.29 请假条』 → 『请假条』
『12.03请假』   → 『请假』
『12.3 测试』   → 『测试』
```

**数字紧邻时间词（不替换）**

```
『4月抽奖活动+月票番外』   → 原样返回（4 紧邻『月』，视为日期）
『6月月票抽奖活动+月票番外。』 → 『6月月票抽奖活动+月票番外』（仅清理标点，不转章节号）
『3年后』                 → 原样返回
『4 月光下』              → 『第4章 月光下』（有空格分隔，仍按章节处理）
```

**括号内容处理**

```
『第1章（上）内容』      → 『第1章 (上) 内容』（非黑名单，转为半角格式，两侧补空格）
『第1章内容（已更新）』  → 『第1章 内容』（命中黑名单字符'更'，整体删除后补空格）
『第2章（上』           → 『第2章 (上)』（未闭合且非黑名单，补右括号转半角）
```

---

## // ==== 2. 配置系统 ====

- 配置说明：
- 所有功能行为都可通过 Config 对象进行精细控制，支持动态修改配置。

#### 完整配置选项说明：

- **punctuationsToRemove** - 需要统一删除的标点字符集
  * string：作为正则字符类使用（默认 `'.。,，、'`）
  * 影响范围：章节标题仅清理章节号与标题的衔接处（前导）及整条标题的末尾，标题内部的标点原样保留；非章节标题（含被日期护栏拦下的标题）一次性全文删除

```
示例：'.。,，、' → 删除英文句点、中文句号、英文逗号、中文逗号、中文顿号
```

- **convertZeroToPreface** - 零值特殊处理
  * boolean：将第零章/第零回等转换为序章/序回
    + `true`：将『第零章』转换为『序章』（默认 false）
    + `false`：保持『第0章』格式

```
示例：『第零回』 → 『序章』（true 时；零值标题不带『第』前缀，后缀跟随 defaultSuffix）
```

- **defaultSuffix** - 统一章节标识符默认后缀
  * string：所有标题统一使用的章节后缀，无论原标题是否含标识符均强制覆盖（默认『章』）

```
示例：『第一百标题』 → 『第100章 标题』
设置为『篇』时：→ 『第100篇 标题』
```

- **preserveSuffixes** - 标识符白名单
  * string：字符串中每个字符均视为一个受保护的标识符，白名单内的标识符原样保留，不被 defaultSuffix 覆盖（默认 `'卷次'`）
  * 设为空字符串时，所有标识符均跟随 defaultSuffix 替换
  * 这些字符会被动态合并到主正则的标识符字符类中以确保正确捕获

```
示例：preserveSuffixes='卷次' 时
  『第二卷』 → 『第2卷』（卷在白名单，保留）
  『第三次』 → 『第3次』（次在白名单，保留）
  『第二节』 → 『第2章』（节不在白名单，用 defaultSuffix）
多个标识符：preserveSuffixes='卷节' → 卷和节均保留
```

#### 配置示例：

```javascript
// 自定义标点字符集（仅删除句号）
Config.punctuationsToRemove = '.。';
// 结果示例：『第1章，内容。』 → 『第1章，内容』

// 启用零值转换
Config.convertZeroToPreface = true;
// 结果示例：『第零章』 → 『序章』

// 自定义默认后缀
Config.defaultSuffix = '节';
// 结果示例：『第一百标题』 → 『第100节 标题』

// 设置标识符白名单（卷和节不被替换）
Config.preserveSuffixes = '卷节';
// 结果示例：『第二卷』→『第2卷』，『第三节』→『第3节』，『第四回』→『第4章』
```

```javascript
const Config = {
    punctuationsToRemove: '.。,，、', // 需要统一删除的标点字符集
    convertZeroToPreface: false,    // 是否将零转换为序
    defaultSuffix: '章',            // 统一章节后缀（覆盖原有标识符）
    preserveSuffixes: '卷次',       // 保护标识符不被 defaultSuffix 覆盖
};
```

---

## // ==== 3. 正则表达式系统 ====

- Regex 对象说明：
- 封装所有预编译正则表达式，避免重复编译，提升性能。
- 标点相关正则均根据 Config.punctuationsToRemove 动态构建。
- chapter / digitalChapter 的标识符字符类由 baseSuffixes + preserveSuffixes 动态合并，每个字符单独转义（共用 punctEscape），防止特殊字符破坏正则字符类。
- digitalTimeUnit / leadingTimeUnit 共用 timeUnits 字符类，已剔除被标识符占用的字符；剔空时置为 null，对应护栏自动失效。
- leadingPunctuations / trailingPunctuations 供 assemble() 清理衔接处与末尾，allPunctuations 仅用于非章节标题的全文删除。
- halfToFull 是半角→全角标点映射表（`: ! ? , ;`），供 assemble() 在章节号与标题之间做分隔符转换。

#### 预编译的正则表达式列表：

1. **chapter** - 主匹配模式（识别「第X章」格式标题）
   - 由默认标识符字符类 + preserveSuffixes 动态构建
   - 分组说明：
     * 第1组：章节数字，优先匹配阿拉伯数字，其次匹配中文数字（支持简繁体及财务大写）
     * 第2组 `([章节回集卷部篇话讲段...]?)`：章节标识符（可选，含白名单字符）
     * 第3组 `(.*)`：标题内容

```
示例：
  『第1章 内容』         → ['1', '章', ' 内容']
  『第壹佰贰拾叁节 内容』→ ['壹佰贰拾叁', '节', ' 内容']
  『第一百标题』         → ['一百', '', '标题']
```

2. **digitalChapter** - 数字标题匹配模式（与 chapter 结构对称）
   - 完整模式：由 allSuffixes 动态构建，`/^(\d+)([章节回集卷部篇话讲段...]?)(.*)/`
   - 分组说明：
     * 第1组 `(\d+)`：数字部分
     * 第2组：章节标识符（可选，含白名单字符）
     * 第3组 `(.*)`：标题内容
   - 用途：一次匹配到位，标识符与内容不再互相误吞

```
示例：
  『29章 请假』   → ['29', '章', ' 请假']
  『5卷内容』     → ['5', '卷', '内容']
  『456测试』     → ['456', '', '测试']
  『58、标题内容』→ ['58', '', '、标题内容']
```

3. **digitalTimeUnit** - 数字+时间词匹配模式（日期护栏）
   - 完整模式：由 timeUnits 动态构建，`/^\d+[季年月日周天期次]/`
   - 用途：步骤4 前置判断，数字**紧邻**时间词的标题视为日期，返回 cleaned

```
示例：
  『4月抽奖活动』 → 命中，不当作章节号
  『4 月光下』    → 不命中（有空格），按章节处理
  『60你好世界』  → 不命中，按章节处理
```

4. **leadingTimeUnit** - 时间词开头匹配模式
   - 完整模式：由 timeUnits 动态构建，`/^[季年月日周天期次]/`
   - 用途：步骤6 中无标识符时判断内容是否以时间词开头，与 digitalTimeUnit 共用同一字符类

```
示例：
  『第三季 回归』 → 内容『季 回归』命中，不当作章节号
  『第一百标题』  → 不命中，按章节处理
```

5. **chinesePunctuation** - 中文标点检测
   - 完整模式：`/^[：、；？！。…]/`
   - 用途：assemble() 中判定是否为紧贴前文的中文标点，命中则不补空格（不含括号与引号）

```
示例：
  『：简介』 → 命中，『第1章：简介』
  『“引言”』→ 不命中，『第1章 “引言”』
```

6. **leadingPunctuations** - 动态生成，匹配开头连续的空白及指定标点
   - 完整模式：`/^[\s.。,，、]+/`
   - 用途：assemble() 清理章节号与标题衔接处的杂符

```
示例：
  『、标题内容』 → 匹配『、』，得『标题内容』
  『 ：“不…”』  → 仅匹配空格（『：』不在字符集内），得『：“不…”』
```

7. **trailingPunctuations** - 动态生成，匹配末尾连续的空白及指定标点
   - 完整模式：`/[\s.。,，、]+$/`
   - 用途：assemble() 清理整条标题末尾的标点

```
示例：
  『内容。』        → 匹配『。』，得『内容』
  『“另一条路。”』 → 不匹配（末尾是『”』），句号保留
```

8. **allPunctuations** - 动态生成（global flag），匹配全文所有指定标点
   - 用途：非章节标题（步骤4 护栏 / 步骤5 / 步骤6 未匹配）的全文清理

```
示例（默认 '.。,，、'）：
  『内容。』 → 匹配『。』
  『标题.』  → 匹配『.』
```

```javascript
var punctEscape = /[-\]\\\^[\/.*+?()|{}$]/g; // 字符类转义，escaped 与 extraSuffixes 共用
var escaped = Config.punctuationsToRemove.replace(punctEscape, '\\$&');
var baseSuffixes = '章节回集卷部篇话讲段';
var extraSuffixes = ''; // 由 preserveSuffixes 动态追加，每个字符单独转义
var allSuffixes = baseSuffixes + extraSuffixes;
var timeUnitsBase = '季年月日周天期次';
var timeUnits = ''; // 剔除与 allSuffixes 冲突的字符后动态构建

var Regex = {
    patterns: {
        chapter: new RegExp('^第(\\d+|[零〇...萬貳參陸]+)([' + allSuffixes + ']?)(.*)'),
        digitalChapter: new RegExp('^(\\d+)([' + allSuffixes + ']?)(.*)'),
        digitalTimeUnit: timeUnits ? new RegExp('^\\d+[' + timeUnits + ']') : null,
        leadingTimeUnit: timeUnits ? new RegExp('^[' + timeUnits + ']') : null,
        chinesePunctuation: /^[：、；？！。…]/,
        leadingPunctuations: new RegExp('^[\\s' + escaped + ']+'),
        trailingPunctuations: new RegExp('[\\s' + escaped + ']+$'),
        allPunctuations: new RegExp('[' + escaped + ']', 'g')
    }
};
```

---

## // ==== 4. 数字转换系统 ====

- NumberConverter 对象说明：
- 独立的中文数字转换器，封装所有数字相关逻辑。

#### 中文数字映射表：

```
// 基础数字
'零':0, '〇':0,
'一':1, '二':2, '两':2,
'三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9,

// 进位单位
'十':10, '百':100, '千':1000, '万':10000,

// 财务大写
'壹':1, '贰':2, '叁':3, '肆':4, '伍':5,
'陆':6, '柒':7, '捌':8, '玖':9,
'拾':10, '佰':100, '仟':1000, '萬':10000,

// 繁体数字
'貳':2, '參':3, '陸':6
```

- convert 算法（逐字扫描，O(n) 时间，O(1) 空间）：
  * 维护两个变量：
    + `total` - 已完成计算的累计值
    + `temp`  - 当前待与进位单位相乘的临时值
  * 规则：
    + 遇到进位单位（十/百/千/万）：
      - temp 若为 0（如『十二』的『十』前无数字），按 1 处理
      - temp × 单位 → 累加到 total，temp 归零
    + 遇到普通数字字符：temp += 数值
    + 循环结束后：total + temp 即为最终结果

```
示例：『貳佰叁拾』
  貳(2)→temp=2；佰(100)→total=200，temp=0
  叁(3)→temp=3；拾(10)→total=230，temp=0
  结果：230
```

```javascript
const NumberConverter = {
    map: { /* 如上所示 */ },

    // 将中文数字字符串转换为阿拉伯数字
    // Rhino 兼容：用 charAt(i) 替代 [i]
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
```

---

## // ==== 5. 主处理函数 ====

- 函数：processTitle
- 功能：处理标题转换的主逻辑
- 参数：title - 原始标题
- 返回：处理后的标题

#### 处理流程：

```
步骤1　括号内容处理　　→ 黑名单字符命中时整体删除，其余转为半角格式并两侧补空格
步骤2　前缀序号剥离　　→ 识别「数字.」开头，剥离前缀序号后交回后续流程（章节号数字后不带「.」）
步骤3　统一标点预处理　→ 预生成 cleaned（全文删除），供非章节标题出口使用
步骤4　数字标题处理　　→ 数字紧邻时间词则返回 cleaned；否则一次匹配数字+标识符+内容后组装
步骤5　非「第」开头处理→ 无章节号可转换，返回 cleaned
步骤6　正则匹配各部分　→ 提取数字、标识符、内容三部分
步骤7　数字转换　　　　→ 阿拉伯数字直接使用，中文数字调用 NumberConverter
步骤8　零值处理与组装　→ 零值转序章（如配置），调用 assemble() 组装最终结果

```

**assemble() 分隔策略：**

先用 leadingPunctuations / trailingPunctuations 清理 titlePart 的衔接处与末尾，标题内部标点原样保留，再按优先级判定分隔符：

```
halfToFull 中的半角标点（: ! ? , ;）  → 转换为对应全角标点，直接拼接
中文标点（：、；？！。…）            → 原样保留，直接拼接，不补空格
原有分隔空格、汉字或英文数字         → 补半角空格
其他符号（括号、引号等）             → 原样保留，直接拼接
```

**resolveSuffix() 后缀解析：**

白名单内的标识符原样保留，其余统一使用 defaultSuffix。步骤4 与步骤6 共用。
空标识符必须先判空 —— `indexOf('')` 恒返回 0，否则会被误判为白名单命中。

```javascript
function resolveSuffix(originalSuffix) {
    return (originalSuffix && Config.preserveSuffixes.indexOf(originalSuffix) >= 0) ?
        originalSuffix : Config.defaultSuffix;
}
```

```javascript
function processTitle(title) {

    // 步骤1：括号内容处理（拆为闭合/未闭合两步，避免 g+$ 回溯问题）
    // 黑名单：含以下字符的括号内容整体删除：票更快祝新迎章订架求免
    var bracketBlacklist = /[票更快祝新迎章订架求免]/;
    title = title.replace(/[（(]([^）)]*)[）)]/g, function(_, inner) {
        return bracketBlacklist.test(inner) ? '' : ' (' + inner + ') ';
    });
    title = title.replace(/[（(]([^）)]*)$/, function(_, inner) {
        return bracketBlacklist.test(inner) ? '' : ' (' + inner + ')';
    });
    title = title.replace(/ {2,}/g, ' ').replace(/^ +| +$/g, '');

    // 步骤2：前缀序号剥离（「数字.」开头视为序号；章节号数字后不带「.」）
    // 剥离后无内容（纯数字如「8.29」）则原样返回，不当作章节号处理
    if (/^\d+\./.test(title)) {
        var stripped = title.replace(/^[\d.]+/, '').replace(/^\s+|\s+$/g, '');
        if (!stripped) return title;
        title = stripped;
    }

    // 步骤3：统一标点预处理（cleaned 仅供非章节标题出口使用）
    var cleaned = title.replace(Regex.patterns.allPunctuations, '');

    // 步骤4：数字标题处理（标识符与内容一次匹配到位）
    if (Regex.patterns.digitalTimeUnit && Regex.patterns.digitalTimeUnit.test(title)) {
        return cleaned;
    }
    var digitalMatch = title.match(Regex.patterns.digitalChapter);
    if (digitalMatch) {
        return assemble('第' + digitalMatch[1], resolveSuffix(digitalMatch[2]), digitalMatch[3]);
    }

    // 步骤5：非「第」开头直接返回
    if (title.charAt(0) !== '第') return cleaned;

    // 步骤6：正则匹配「第X章」各部分
    var match = title.match(Regex.patterns.chapter);
    if (!match) return cleaned;

    var chineseNum = match[1];
    var originalSuffix = match[2];
    var titlePart = match[3] || '';

    // 无标识符时，若内容以时间词开头则原样返回，避免误匹配
    if (!originalSuffix && Regex.patterns.leadingTimeUnit &&
        Regex.patterns.leadingTimeUnit.test(titlePart.replace(/^\s+/, ''))) {
        return cleaned;
    }

    var suffix = resolveSuffix(originalSuffix);

    // 步骤7：数字转换
    var number = /^\d+$/.test(chineseNum) ? chineseNum : NumberConverter.convert(chineseNum);

    // 步骤8：零值处理与组装（零值标题不带「第」前缀）
    if (Number(number) === 0 && Config.convertZeroToPreface) {
        return assemble('', '序' + suffix, titlePart);
    }
    return assemble('第' + number, suffix, titlePart);
}
```

---

## 赞助

<p align="center">
  <img src="https://free.picui.cn/free/2026/06/24/6a3b25866f0fd.jpg" width="100%" alt="赞助图片">
</p>
