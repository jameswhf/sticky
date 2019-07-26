const R = require('ramda')

function IndexNode (key, height, y0) {
    this.key = key
    this.height = height
    this.y0 = y0 // FIXED触发的边界左值
}
IndexNode.prototype.setExtent = function (y1, y2) {
    this.y1 = y1 // FIXED 需要移动的边界
    this.y2 = y2// FIXED触发的边界右值
}
IndexNode.prototype.translateY = function (scrollY) {
    if (scrollY < this.y1) return 0
    return scrollY - this.y1
}

function sticky () {
    return new Sticky()
}

function Sticky () {

}

Sticky.prototype.addAll = (data) => {
    const orderedNodes = R.pipe(
        R.map(datum => new IndexNode(datum.key, datum.height, datum.y0)),
        R.sortBy(R.prop('y0')),
        R.reverse,
    )(data)
    let preNode = null
    orderedNodes.forEach((node, index) => {
        if (index == 0) {
            node.setExtent(-1, -1)
        } else {
            node.setExtent(preNode.y0 - node.height, preNode.y0)
        }
        preNode = node
    })
    this.nodes = R.reverse(orderedNodes)
}

/**
 * 根据scrollY反查受影响的IndexNode
 */
Sticky.prototype.visit = (scrollY) => {
    const cacheDistance = 0
    return this.nodes.filter(node => {
        if (scrollY < node.y0) return node.y0 - scrollY < cacheDistance
        if (scrollY > node.y2) return scrollY - node.y2 < cacheDistance
        return true
    })
}

const data = [
    { key: '筛选器组_001', y0: 6, height: 60 },
    { key: 'tab_A', y0: 66 * 2, height: 180 },
    { key: '筛选器组_002', y0: 600, height: 60 },
    { key: 'tab_B', y0: 420, height: 120 },
]

const sty = sticky()
sty.addAll(data)

console.log(sty.visit(3))

