/**
 * Template string implementation
 * @param {string} template template string with variables marked as `${var}`
 * @param {object} variables object containing variables
 * @returns {string} compiled string
 */
export default function templateString(template, variables) {
  let keys = Object.keys(variables);
  let result = template;
  keys.forEach(key => {
    if (typeof variables[key] === "object") {
      throw new Error("value is not primitive type");
    }
    let regex = new RegExp(`\\$\\{${key}\\}`);
    result = result.replace(regex, variables[key]);
  });

  return result;
}

let input = "name: ${name}, age: ${age}";
let obj = { name: "hello world", age: 20 };
console.log(templateString(input, obj));