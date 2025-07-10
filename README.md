# #01 数字标题#JS
[![Channel](https://img.shields.io/badge/Telegram-Channel-blue?style=flat-square&logo=telegram)](https://t.me/sjshb_2157)
###   * 作者：sjshb
###  // ==== 1. 功能文档 ====
 * 功能概述：
 * 本脚本是一个高级中文数字标题转换工具，专门用于处理各种格式的中文数字标题，将其转换为统一的阿拉伯数字格式，同时提供多种智能处理选项。 
#### 主要功能亮点：

    1. 全面支持简繁体中文数字转换（零-萬）
    2. 支持繁体大写数字（壹貳參等）
    3. 智能空格处理（智能处理章节与内容间的空格）
    4. 标点符号规范化（移除内容末尾冗余标点）
    5. 非章节标题句号清理（『请。假。』→『请假』）
    6. 特殊章节处理（『第零章』→『序章』）
    7. 支持纯数字标题转换（『1 内容』→『第1章 内容』）
    8. 无标识符标题兼容（『第一百标题』→『第100章 标题』）
    9. 多章节标识符适配（章/节/回/集等）
    10. 灵活的配置系统（动态调整空格/标点等规则）
   * 典型输入输出示例（五大类）：
   * 输入 → 输出
     
   *基础数字转换
   
    『第一章 内容』 → 『第1章 内容』
    『第壹佰贰拾叁节』 → 『第123节』
    『第伍萬陆仟柒佰捌拾篇』 → 『第5678篇』
     
   *零值与特殊格式
   
    『第零回 内容』 → 『序回 内容』
    『第一百标题』 → 『第100章 标题』
    『第〇章 空白』 → 『第0章 空白』
     
   *空格与标点规范
   
    『第1章内容』 → 『第1章 内容』（自动补空格）
    『第1章：简介』 → 『第1章：简介』（中文标点前不补空格）
    『请假。』 → 『请假』（移除非标题句号）
     
   *纯数字标题处理
   
    『123』 → 『第123章』
    『456内容』 → 『第456章 内容』
    『01 测试』 → 『第01章 测试』
     
   *混合与边界示例
   
    『第1章　内容』 → 『第1章　内容』（保留全角空格）
    『第零章测试』 → 『序章 测试』（零值转换+空格）
    『第100章.』 → 『第100章』（标点清理优先级）

###  // ==== 2. 配置系统 ====
   * 配置说明：
   * 所有功能行为都可通过Config对象进行精细控制，支持动态修改配置。
#### 完整配置选项说明：
    
   * removePunctuation - 控制是否移除标题末尾标点
   *   true: 自动移除以『第』开头的标题末尾的。！？.等标点（默认true）
   *   false: 保留所有标点符号
   *   影响范围：仅章节标题（以『第』开头的标题）
      
      示例：『第一章。』 → 『第1章』 (true时)
      
   * autoAddSpace - 控制是否自动添加空格
   *   true: 在章节号和内容间智能添加空格（默认true）
   *   false: 保持原始空格状态
      
      示例：『第1章内容』 → 『第1章 内容』 (true时)
    
   * convertZeroToPreface - 零值特殊处理
   *   true: 将『第零章』转换为『序章』（默认false）
   *   false: 保持『第0章』格式
      
      示例：『第零回』 → 『序回』 (true时)
    
   * maxCacheSize - 最大缓存条目数
   *   数值: 限制每种缓存的最大条目数（默认100）
     
      示例：设置为100时，超过100个正则表达式后会随机清理
    
   * defaultSuffix - 无标识符时的默认后缀
   *   字符串: 当标题无章节标识符时使用的默认后缀（默认『章』）
      
      示例: 『第一百标题』 → 『第100章 标题』
    
   * removePeriods - 控制是否移除非章节标题中的所有句号
   *   true: 自动移除不以『第』开头的标题中的。和.标点（默认true）
   *   false: 保留句号
   *   影响范围：仅非章节标题（不以『第』开头的标题）
      
      示例：
        『内容。』 → 『内容』 (true时)
        『标题.』 → 『标题』 (true时)
    
   * 配置示例：
     
    // 保留所有标点并不自动添加空格
    Config.update({ removePunctuation: false, autoAddSpace: false });
    // 结果示例：『第1章内容。』 → 『第1章内容。』
     
    // 启用零值转换
    Config.update({ convertZeroToPreface: true });
    // 结果示例：『第零章』 → 『序章』
     
    // 自定义配置组合1
    Config.update({ removePunctuation: true, autoAddSpace: false });
    // 结果示例：『第1章内容！』 → 『第1章内容』
     
    // 自定义配置组合2
    Config.update({ removePunctuation: false, autoAddSpace: true });
    // 结果示例：『第1章内容。』 → 『第1章 内容。』
     
    // 自定义默认后缀
    Config.update({ defaultSuffix: '节' });
    // 结果示例：『第一百标题』 → 『第100节 标题』
     
    // 复杂配置示例1
    Config.update({ 
      removePunctuation: true,
      autoAddSpace: true,
      convertZeroToPreface: true,
      defaultSuffix: '回'
    });
    // 结果示例：『第零回内容！』 → 『序回 内容』
    
    // 复杂配置示例2
    Config.update({ 
      removePunctuation: false,
      autoAddSpace: false,
      convertZeroToPreface: false,
      defaultSuffix: '篇'
    });
    // 结果示例：『第壹佰贰拾叁内容。』 → 『第123篇内容。』
  
  const Config = {
  
    removePunctuation: true,    // 是否移除章节末尾标点

    autoAddSpace: true,         // 是否自动添加空格
    
    convertZeroToPreface: false, // 是否将零转换为序
    
    maxCacheSize: 100,          // 最大缓存条目数
    
    defaultSuffix: '章',        // 无标识符时的默认后缀
    
    removePeriods: true,        // 是否移除标题句号
    
    /*
     * 方法：update
     * 功能：动态更新配置参数
     * 参数：newConfig - 包含新配置项的对象
     * 返回：无
     */
    update: function(newConfig) {
      Object.assign(this, newConfig);
    }
  };

###  // ==== 3. 正则表达式系统 ====
   * Regex 对象说明：
   * 封装所有正则表达式相关操作，包含预编译模式和智能缓存系统。
#### 预编译的正则表达式列表：

    1. chinesePunctuation - 中文标点检测（匹配：、，；等）
   *   模式：/^[：、，；？！（）「」【】]/
   *   用途：防止在中文标点前添加空格
   *   示例：
   *     『：内容』 → 匹配『：』
   *     『，测试』 → 匹配『，』
      
    2. chapter - 主匹配模式（识别中文数字标题）
   *   完整模式：/^第([零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([章节回集卷部篇话讲段]?)(.*)/
   *   分组说明：
   *     第1组([零-萬]+)：中文数字部分
   *     第2组([章节回集卷部篇话讲段]?)：章节标识符（可选）
   *     第3组(.*)：标题内容
   *   示例：
   *     『第壹佰贰拾叁节』 → [『壹佰贰拾叁』, 『节』, 『』]
   *     『第一百标题』  → [『一百』, 『』, 『标题』]
   *     『第两万零五卷』 → [『两万零五』, 『卷』, 『』]
    
    3. digitalChapter - 数字标题匹配模式
   *   完整模式：/^(\d+)\s*(.*)/
   *   分组说明：
   *     第1组(\d+)：数字部分
   *     第2组(.*)：标题内容
   *   用途：处理纯数字标题
   *   示例：
   *     『1 内容』 → [『1』, 『内容』]
   *     『123测试』 → [『123』, 『测试』]
    
    4. titlePunctuation - 全局标点处理（匹配所有标题结尾标点）
   *   完整模式：/[。！？.，：；]+$/
   *   支持标点：中文。！？，：；和英文.
   *   示例：
   *     『内容。』 → 匹配『。』
   *     『标题！』 → 匹配『！』
   *     『结尾；』 → 匹配『；』
    
    5. period - 非章节类型标题句号匹配模式
   *   完整模式：/[。.]/g
   *   用途：全局匹配所有中文和英文句号
   *   示例：
   *     『内容。』 → 匹配『。』
   *     『标题.』 → 匹配『.』
    
  const Regex = {
  
    // 正则表达式缓存
    cache: {},
    
    // 预编译的正则表达式模式
    patterns: {
      chinesePunctuation: /^[：、，；？！（）「」【】]/,
      chapter: /^第([零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([章节回集卷部篇话讲段]?)(.*)/,
      digitalChapter: /^(\d+)\s*(.*)/,
      titlePunctuation: /[。！？.，：；]+$/,
      period: /[。.]/g
    },
    
    /*
     * 方法：getSpaceRegex
     * 功能：获取或创建空格检测正则表达式（带缓存）
     * 参数：suffix - 章节标识符（如『章』/『节』）
     * 返回：预编译的正则对象
     */
    getSpaceRegex: function(suffix) {
      if (this.cache[suffix]) {
        return this.cache[suffix];
      }
      
      const keys = Object.keys(this.cache);
      if (keys.length >= Config.maxCacheSize) {
        delete this.cache[keys[Math.floor(Math.random() * keys.length)]];
      }
      
      this.cache[suffix] = new RegExp(`第[^\\s]*${suffix}[\\s　]+`);
      return this.cache[suffix];
    }
  };

###  // ==== 4. 数字转换系统 ====
   * NumberConverter 对象说明：
   * 独立的中文数字转换器，封装所有数字相关逻辑。
#### 中文数字映射表：

    // 小写数字
    '零':0, '〇':0, // 零的两种写法
    '一':1, '二':2, '两':2, // 『两』作为『二』的替代
    '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9,
    
    // 单位数字
    '十':10, '百':100, '千':1000, '万':10000,
    
    // 大写数字（财务用）
    '壹':1, '贰':2, '叁':3, '肆':4, '伍':5, 
    '陆':6, '柒':7, '捌':8, '玖':9,
    '拾':10, '佰':100, '仟':1000, '萬':10000,
    
    // 繁体数字
    '貳':2, '參':3, '陸':6
  
  const NumberConverter = {
  
    map: { /* 如上所示 */ },
    
    /*
     * 方法：convert
     * 功能：将中文数字转换为阿拉伯数字
     * 参数：chineseNum - 中文字符串
     * 返回：Number 转换结果
     */
    convert: function(chineseNum) {
      let total = 0;
      let temp = 0;
      
      for (let i = 0; i < chineseNum.length; i++) {
        let char = chineseNum[i];
        let val = this.map[char];
        
        if ([10, 100, 1000, 10000].includes(val)) {
          temp = (temp === 0 ? 1 : temp) * val;
          total += temp;
          temp = 0;
        }
        else if (val !== undefined) {
          temp += val;
        }
      }
      
      return total + temp;
    }
  };

###  // ==== 5. 主处理函数 ====
   * 函数：processTitle
   * 功能：处理标题转换的主逻辑
   * 参数：title - 原始标题
   * 返回：处理后的标题
#### 处理流程：

    1. 纯数字标题处理 → 转换为章节格式
    2. 非章节标题处理 → 移除句号（如配置）
    3. 全局标点处理 → 移除末尾标点（如配置）
    4. 正则匹配标题各部分 → 提取中文数字、标识符和内容
    5. 数字转换 → 调用NumberConverter
    6. 零值特殊处理 → 转换为序章（如配置）
    7. 智能空格处理 → 自动添加空格（如配置）
    8. 结果组装 → 生成最终标题
  
  function processTitle(title) {
  
    // 纯数字标题处理
    const digitalMatch = title.match(Regex.patterns.digitalChapter);
    if (digitalMatch) {
      const [, num, content] = digitalMatch;
      const trimmedContent = content.trim();
      
      if (trimmedContent === '') {
        return `第${num}${Config.defaultSuffix}`;
      }
      
      return `第${num}${Config.defaultSuffix} ${trimmedContent}`;
    }

    // 非章节标题处理
    if (!title.startsWith("第")) {
      if (Config.removePeriods) {
        return title.replace(Regex.patterns.period, '');
      }
      return title;
    }
    
    // 全局标点处理
    if (Config.removePunctuation) {
      title = title.replace(Regex.patterns.titlePunctuation, '');
    }
    
    // 正则匹配标题各部分
    const match = title.match(Regex.patterns.chapter);
    if (!match) return title;
    
    // 提取匹配组
    const [, chineseNum, originalSuffix, titlePart] = match;
    let suffix = originalSuffix || Config.defaultSuffix;
    const cleanTitlePart = (titlePart || '').trim();
    
    // 中文数字转换
    let number = NumberConverter.convert(chineseNum);
    
    // 零值特殊处理
    if (number === 0 && Config.convertZeroToPreface) {
      number = '';
      suffix = '序' + suffix;
    }
    
    // 智能空格处理
    let hasSpace = Config.autoAddSpace 
      ? /[\s　]/.test(title.slice(match[0].length - (originalSuffix || Config.defaultSuffix).length - 1))
      : true;
    
    // 结果组装
    if (cleanTitlePart) {
      const shouldAddSpace = Config.autoAddSpace && 
                           !hasSpace && 
                           !Regex.patterns.chinesePunctuation.test(cleanTitlePart);
      return `第${number}${suffix}${shouldAddSpace ? ' ' : ''}${cleanTitlePart}`;
    }
    
    return `第${number}${suffix}`;
  }
##  /*==== 版本更新日志 ====*/
   * 
   * [v1.0] 第一初版 - 基础功能
   * - 实现基础中文数字转换（零-千）
   * - 仅支持'章'和'节'两种标识
   * - 简单数字累加算法
   * 
   * [v1.1] 第一次修改 - 标题提取
   * - 新增标题内容提取功能
   * - 修复数字转换时的边界错误
   * 
   * [v1.2] 第二次修改 - 扩展标识符
   * - 增加支持[回集卷部篇]五种新标识
   * - 改进数字转换算法（修正十位处理）
   * 
   * [v1.3] 第三次修改 - 空格处理
   * - 新增智能空格检测
   * - 自动保留原空格或添加一个空格
   * 
   * [v1.4] 第四次修改 - 标点处理
   * - 增加移除标题末尾中文句号功能
   * - 优化正则表达式性能
   * 
   * [v1.5] 第五次修改 - 代码注释
   * - 为所有关键代码添加详细注释
   * - 优化变量命名
   * 
   * [v1.6] 第六次修改 - 正则优化
   * - 重构正则分组结构
   * - 预编译正则表达式
   * 
   * [v1.7] 第七次修改 - 新增标识
   * - 增加支持'话'标识
   * - 修复百位数字转换bug
   * 
   * [v1.8] 第八次修改 - 万字支持
   * - 新增'万'字单位支持
   * - 扩大数字长度限制{1,9}
   * - 优化大数字处理性能
   * 
   * [v1.9] 第九次修改 - 完整增强
   * - 增加支持'讲'和'段'标识
   * - 支持全角空格检测
   * - 扩展标点处理范围（！？.）
   * - 添加完整历史注释
   * 
   * [v2.0.0] 第十次修改 - 功能增强
   * - 增加正则缓存提升性能
   * - 添加配置项开关
   * - 补充测试用例文档
   * - 预留大写数字扩展
   * - 优化空格显示
   * 
   * [v2.1.0] 第十一次修改 - 大写数字扩展
   * - 支持中文大写数字（壹贰叁...）
   * - 扩展正则表达式匹配范围
   * - 更新数字映射表
   * 
   * [v2.1.1] 第十二次修改 - 更新注释
   * - 更新多项使用示例和使用说明
   * 
   * [v2.2.0] 第十三次修改 - 性能与功能增强
   * - 扩展正则缓存机制
   * - 增加零值特殊处理功能
   * - 更新相关注释和示例
   *
   * [v2.2.5] 第十四次修改 - 文档完善
   * - 全面增强代码注释和文档
   * - 为每个功能模块添加详细说明
   * - 更新所有注释和示例
   * - 增加大量使用示例
   * - 优化代码结构和可读性
   * 
   * [v2.3.0] 第十五次修改 - 繁体中文支持
   * - 增加支持'貳參陸'等繁体数字
   * - 扩展数字映射表
   * - 更新正则表达式匹配范围
   * - 补充繁体数字转换示例
   * 
   * [v2.3.1] 第十六次修改 - 标点处理增强
   * - 修复非章节标题的标点移除问题
   * - 增强标点处理正则表达式
   * - 更新相关注释和示例
   * 
   * [v2.3.5] 第十七次修改 - 文档与注释改进
   * - 为所有功能模块添加详细注释
   * - 增加30+实际使用示例
   * - 优化配置系统文档
   * - 完善正则表达式说明
   * 
   * [v2.3.6] 第十八次修改 - 缓存增强
   * - 增强正则表达式缓存机制
   * - 添加缓存命中率统计
   * - 优化缓存生命周期管理
   * - 添加缓存大小限制
   * 
   * [v2.4.0] 第十九次修改 - 无标识符标题支持
   * - 增加对'第一百九十八标题'格式的支持
   * - 更新正则表达式匹配模式
   * - 扩展章节标识符检测逻辑
   * - 更新所有文档和示例
   *  
   * [v2.4.1] 第二十次修改 - 移除非必要功能
   * - 移除统计代码
   * - 简化缓存系统
   * - 删除严格模式
   * 
   * [v2.4.2] 第二十一次修改 - 文档与示例增强
   * - 为所有代码块添加详细注释
   * - 重新举例典型示例
   * - 优化配置系统文档
   * - 完善正则表达式说明
   *
   * [v2.5.0] 第二十二次修改 - 模块化重构版本
   * - 采用模块化架构重构代码
   * - 优化正则缓存性能
   * - 增强配置灵活性
   *
   * [v2.5.2] 第二十三次修改 - 优化代码
   * - 删除无用代码
   * - 修复一处错误
   * - 改进空格检测逻辑
   * - 完善文档注释示例
   *
   * [v2.5.4] 第二十四次修改 - 增强功能
   * - 对非章节标题的句号处理
   * - 修改错误注释并完善文档
   * - 增加removePeriods配置项
   *
   * [v2.5.6] 第二十五次修改 - 功能增强
   * - 新增对纯数字标题的处理
   * - 添加digitalChapter正则匹配
   * - 完善文档注释并统一为中文引用
   *
