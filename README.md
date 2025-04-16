# #01 数字标题#JS
###   * 作者：sjshb
###  // ==== 1. 功能文档 ====
   * 功能概述：
   * 本脚本是一个高级中文数字标题转换工具，专门用于处理各种格式的中文数字标题，
   * 将其转换为统一的阿拉伯数字格式，同时提供多种智能处理选项。 
#### 主要功能亮点：

    1. 全面支持简繁体中文数字转换（零-萬）
    2. 智能空格处理，自动检测并修正空格问题
    3. 标点符号规范化（现在适用于所有标题类型）
    4. 特殊章节处理（如将'第零章'转为'序章'）
    5. 完整支持繁体中文数字（壹貳參等）
    6. 灵活的配置系统（支持动态修改配置）
    7. 完善的文档和注释系统（包含详细的使用说明）
    8. 支持无标识符标题格式（例如第一百标题）
    9. 兼容性广泛（支持多种章节标识符） 
   * 典型输入输出示例（五大类）：
   * 输入 → 输出
     
   *基础转换示例
   
    '第一章 内容' → '第1章 内容'
    '第壹佰贰拾叁节' → '第123节'
    '第两章测试' → '第2章 测试'
     
   *复杂数字示例
   
    '第伍萬陆仟柒佰捌拾玖篇' → '第56789篇'
    '第壹萬零伍佰章' → '第10500章'
    '第參佰陸拾伍章' → '第365章'
     
   *零值处理示例
   
    '第零回 序言' → '序回 序言' (开启零值转换时)
    '第零卷' → '序卷' (开启零值转换时)
    '第〇章 空白' → '第0章 空白' (未开启零值转换时)
     
   *无标识符标题示例
   
    '第一百标题' → '第100章 标题'
    '第三百六十五测试' → '第365章 测试'
    '第五百零二' → '第502章'
     
   *标点与空格示例
   
    '内容。' → '内容' (全局标点移除)
    '第1章内容' → '第1章 内容' (自动补空格)
    '第1章：简介' → '第1章：简介' (中文标点前不补空格)

###  // ==== 2. 配置系统 ====
   * 配置说明：
   * 所有功能行为都可通过config对象进行精细控制。
   * 修改配置后无需重启，立即生效。
#### 完整配置选项说明：
    
   * removePunctuation - 控制是否移除标题末尾标点（现在适用于所有标题类型）
   *   true: 自动移除标题末尾的。！？.等标点（默认）
   *   false: 保留所有标点符号
   *   影响范围：所有标题（包括非章节标题）
      
      示例：'内容。' → '内容' (true时)
      
   * autoAddSpace - 控制是否自动添加空格
   *   true: 在章节号和内容间智能添加空格（默认）
   *   false: 保持原始空格状态
      
      示例：'第1章内容' → '第1章 内容' (true时)
    
   * convertZeroToPreface - 零值特殊处理
   *   true: 将'第零章'转换为'序章'
   *   false: 保持'第0章'格式（默认）
      
      示例：'第零回' → '序回' (true时)
    
   * maxCacheSize - 最大缓存条目数
   *   数值: 限制每种缓存的最大条目数（默认100）
     
      示例：防止内存无限增长
    
   * defaultSuffix - 无标识符时的默认后缀
   *   字符串: 当标题无章节标识符时使用的默认后缀
   *   默认值: '章'
      
      示例: '第一百标题' → '第100章 标题'
    
   * 配置示例：
     
    // 保留所有标点并不自动添加空格
    config.removePunctuation = false;
    config.autoAddSpace = false;
    // 结果示例：'第1章内容。' → '第1章内容。'
     
    // 启用零值转换
    config.convertZeroToPreface = true;
    // 结果示例：'第零章' → '序章'
     
    // 自定义配置组合1
    config.removePunctuation = true;
    config.autoAddSpace = false;
    // 结果示例：'第1章内容！' → '第1章内容'
     
    // 自定义配置组合2
    config.removePunctuation = false;
    config.autoAddSpace = true;
    // 结果示例：'第1章内容。' → '第1章 内容。'
     
    // 自定义默认后缀
    config.defaultSuffix = '节';
    // 结果示例：'第一百标题' → '第100节 标题'
     
    // 复杂配置示例1
    config.removePunctuation = true;
    config.autoAddSpace = true;
    config.convertZeroToPreface = true;
    config.defaultSuffix = '回';
    // 结果示例：'第零回内容！' → '序回 内容'
    
    // 复杂配置示例2
    config.removePunctuation = false;
    config.autoAddSpace = false;
    config.convertZeroToPreface = false;
    config.defaultSuffix = '篇';
    // 结果示例：'第壹佰贰拾叁内容。' → '第123篇内容。'
  
  const config = {
  
    removePunctuation: true,    // 是否移除末尾标点

    autoAddSpace: true,         // 是否自动添加空格
    
    convertZeroToPreface: false, // 是否将零转换为序
    
    maxCacheSize: 100,          // 最大缓存条目数
    
    defaultSuffix: '章'         // 无标识符时的默认后缀
  }

###  // ==== 3. 正则表达式系统 ====
   * 正则表达式缓存系统：
   * 所有正则表达式都经过预编译和缓存，确保最佳性能。
   * 系统会自动管理正则表达式的生命周期。 
#### 预编译的正则表达式列表：

    1. spaceCheck - 动态生成的空间检测正则（按章节标识缓存）
   *   功能：检测章节标识符前后的空格
   *   生成规则：/[\s　]*章[\s　]+/
   *   缓存策略：每种标识符单独缓存
   *   示例：
   *     '章' → /[\s　]*章[\s　]+/
   *     '节' → /[\s　]*节[\s　]+/
      
    2. punctuation - 标点符号检测（匹配。！？.等结尾标点）
   *   模式：/[。！？.]+$/
   *   用途：移除章节标题末尾标点
   *   示例：
   *     '内容。' → 匹配'。'
   *     '标题！' → 匹配'！'
    
    3. chinesePunctuation - 中文标点检测（匹配：、，；等）
   *   模式：/^[：、，；？！（）「」【】]/
   *   用途：防止在中文标点前添加空格
   *   示例：
   *     '：内容' → 匹配'：'
   *     '，测试' → 匹配'，'
    
    4. chapterPattern - 主匹配模式（识别中文数字标题）
   *   模式：/^第([零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([章节回集卷部篇话讲段]?)(.*)/
   *   修改说明：章节标识符变为可选
   *   分组：
   *     第1组：中文数字部分
   *     第2组：章节标识符（可能为空）
   *     第3组：标题内容
   *   示例：
   *     '第壹佰贰拾叁节' → ['壹佰贰拾叁', '节', '']
   *     '第一百标题' → ['一百', '', '标题']
    
    5. allTitlePunctuation - 全局标点处理（匹配所有标题结尾标点）
   *   增强模式：/[。！？.，：；]+$/
   *   修改说明：现在能正确处理更多标点类型
   *   示例：
   *     '内容。' → 匹配'。'
   *     '标题！' → 匹配'！'
   *     '结尾；' → 匹配'；'
    
  const regexCache = {

    // 空格检测正则缓存（按章节标识动态生成）
    // 结构：
    { '章': /[\s　]*章[\s　]+/, '节': /[\s　]*节[\s　]+/, ... }
    // 用途：检测特定章节标识符前后的空格
    
    spaceCheck: {},
    // 标点检测正则（预编译）
    
    // 功能：匹配标题末尾的标点符号
    // 示例：'内容！' → 匹配'！'
    punctuation: /[。！？.]+$/,
    
    // 中文标点检测正则（预编译）
    // 功能：识别中文标点符号
    // 示例：'：内容' → 匹配'：'
    chinesePunctuation: /^[：、，；？！（）「」【】]/,
    
    // 主匹配正则（预编译）
    // 功能：提取中文数字标题的各个部分
    // 示例：'第貳佰章 内容' → ['貳佰', '章', ' 内容']
    chapterPattern: /^第([零〇一二三四五六七八九十百千两万壹贰叁肆伍陆柒捌玖拾佰仟萬貳參陸]+)([章节回集卷部篇话讲段]?)(.*)/,
    
    // 所有标题标点检测（增强）
    // 功能：全局处理所有标题的末尾标点（包括非章节标题）
    // 示例：'请假条。' → 匹配'。'
    allTitlePunctuation: /[。！？.，：；]+$/
  }

   * 函数：getSpaceRegex
   * 功能：获取或创建空格检测正则表达式（带缓存）
   * 参数：suffix - 章节标识符（如'章'/'节'）
   * 返回：预编译的正则对象
    
   * 算法说明：
    
    1. 检查缓存中是否已存在该标识符的正则
       - 是 → 返回缓存结果
       - 否 → 继续步骤2
          
    2. 检查缓存是否已达上限
       - 是 → 随机移除一个条目
          
    3. 创建新正则表达式
       - 模式：/[\\s　]*${suffix}[\\s　]+/
          
    4. 将新正则存入缓存
    
    5. 返回新正则
     
   * 使用示例：
    
    getSpaceRegex('章') → /[\s　]*章[\s　]+/

    getSpaceRegex('回') → /[\s　]*回[\s　]+/
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
