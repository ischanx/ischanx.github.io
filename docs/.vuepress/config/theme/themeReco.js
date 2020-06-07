module.exports = {
    type: 'blog',
    // 博客设置
    blogConfig: {
        category: {
            location: 2, // 在导航栏菜单中所占的位置，默认2
            text: '分类' // 默认 “分类”
        },
        tag: {
            location: 3, // 在导航栏菜单中所占的位置，默认3
            text: '标签' // 默认 “标签”
        }
    },
    authorAvatar: '/avatar.png',
    // 最后更新时间
    lastUpdated: '上次更新时间', // string | boolean
    // 作者
    author: 'CHANX',
    // 项目开始时间
    startYear: '2020'
}