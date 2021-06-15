/*
 * Define some regular expressions for sensitive data
 * e.g. address, phone number, credit card number
 */

const addressRegex = /(\D{1,2}[縣市])(\D+?[鄉鎮市區])?(\D+?[村里])?(\d+?[鄰])?(\D+?[路街道段])?(\D+?段)?(\d+?巷)?(\d+?弄)?(\d+?號)?(\d+?樓)?/;
const phoneRegex = /[0-9-]{10,}/;

const allRegex = [addressRegex, phoneRegex]

export default allRegex;
