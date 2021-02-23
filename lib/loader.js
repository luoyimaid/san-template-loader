/**
 * @file san component loader
 * @author luoyi06
 */

const loaderUtils = require('loader-utils');
const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const aNodeUtils = require('san-anode-utils');

module.exports = function (source) {
    const loaderOptions = loaderUtils.getOptions(this);
    // mode strict/compact 严格模式/兼容模式
    // 严格模式下不允许在template里写字符串表达式；兼容模式下可支持字符串表达式，默认严格模式，希望后续可遵循规范
    const {compileTemplate = '', mode = 'strict'} = loaderOptions;

    const options = {
        sourceType: 'module',
        plugins: [
            'classProperties'
        ]
    };

    // 获取资源文件的ast
    let ast = parse(source, options);
    const that = this;

    // if (that.resourcePath === '/Users/luoyi06/baidu/landing-component/@baidu/led-ui-quick-evaluate/index.js') {
    //     console.log(JSON.stringify(ast));
    // }

    const handleCompileTemplate = ({compileTemplate, aNode, path}) => {
        switch (compileTemplate) {
            case 'aNode':
                path.insertAfter(t.classProperty(
                    t.identifier('aNode'),
                    t.objectExpression(aNode),
                    null,
                    null,
                    false,
                    true
                ));
                break;
            case 'aPack':
                if (aNode.children.length) {
                    let aPack = aNodeUtils.pack(aNode.children[0]);
                    path.insertAfter(t.classProperty(
                        t.identifier('aPack'),
                        t.arrayExpression(
                            aPack.map(item => {
                                return typeof item === 'number'
                                    ? t.numericLiteral(item)
                                    : (typeof item === 'string'
                                        ? t.stringLiteral(item)
                                        : t.nullLiteral()
                                    );
                            })
                        ),
                        null,
                        null,
                        false,
                        true
                    ));
                }
                break;
            default:
                break;
        }
    }


    // 修改ast，把template节点改为anode/apack节点，并赋值给新增变量
    const visitor = {
        ClassProperty(path) {
            let key = path.node.key || {};

            if (compileTemplate && key.name === 'template') {

                const isStringTemplate = Array.isArray(path.node.value.expressions)
                    && path.node.value.expressions && path.node.value.expressions.length;

                let value = Array.isArray(path.node.value.quasis)
                    && path.node.value.quasis[0]
                    && path.node.value.quasis[0].value
                    ? path.node.value.quasis[0].value : {};
                let aNode = aNodeUtils.parseTemplate(value.raw || '');

                // 严格模式下，并且有字符串表达式，直接抛出错误
                if (mode === 'strict' && isStringTemplate) {
                    throw new Error(`${that.resourcePath}报错，template模板不支持字符串表达式`);
                }
                // 兼容模式下，并且无字符串表达式，template --> apack，其余情况不做处理
                else if (mode === 'compact' && !isStringTemplate) {
                    handleCompileTemplate({
                        compileTemplate,
                        aNode,
                        path
                    });
                    path.remove();
                }
            }
        }
    };
    traverse(ast, visitor);

    const output = generate(ast, {
        compact: true,
        comments: false,
        jsonCompatibleStrings: true
    });

    console.log(output.code);

    return output.code;
};
