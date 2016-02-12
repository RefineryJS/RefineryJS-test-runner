export default function nicePlugin ({types: t}) {
  return {
    visitor: {
      Identifier (path) {
        const {node: {name}} = path
        if (name === 'evil') {
          path.replaceWith(t.identifier('nice'))
        }
      },
    },
  }
}
