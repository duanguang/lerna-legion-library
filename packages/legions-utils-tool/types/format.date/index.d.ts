/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
export declare function formatDate(date: Date | number, fmt: string): string;
/**
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
 * @returns 解析后的Date类型日期
 */
export declare function parseDate(str: string, fmt: 'yyyy-MM-dd' | 'yyyy-MM' | 'yyyy-MM-dd hh:mm:ss' | 'yyyy-MM-dd hh' | 'yyyy-MM-dd hh:mm' | 'hh:mm' | 'mm'): Date;
/**
 * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
 * 当天的返回时分，当年的返回月日，否则，返回年月日
 * @param {Object} date
 */
export declare function formatDateToFriendly(date: Date): string;
/**
 * 将一段时长转换成友好格式，如：
 * 147->“2分27秒”
 * 1581->“26分21秒”
 * 15818->“4小时24分”
 * @param {Object} second
 */
export declare function formatDurationToFriendly(second: number): string;
/**
 * 将时间转换成MM:SS形式
 */
export declare function formatTimeToFriendly(second: number): string;
/**
 * 判断某一年是否是闰年
 * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
 */
export declare function isLeapYear(year: Date | number): boolean;
/**
 * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
 * 方式一：getMonthDays();
 * 方式二：getMonthDays(new Date());
 * 方式三：getMonthDays(2013, 12);
 */
export declare function getMonthDays(date?: Date | number, month?: number): number;
/**
 * 计算2日期之间的天数，用的是比较毫秒数的方法
 * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
 * @param date1 日期一
 * @param date2 日期二
 */
export declare function countDays(date1: Date | string, date2: Date | string): number;
/**
 *获取指定日期月数最后一天
 *
 * @export
 * @param {*} date
 * @returns
 */
export declare function getLastDay(date: Date | number | string): string;
