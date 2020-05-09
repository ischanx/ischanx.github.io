const themeConfig = require('./config/theme/index.js')
const navConf = require('./config/nav/index')
const sidebarConf = require('./config/sidebar/index')
const pluginsConf = require('./config/plugins/index')
module.exports = {
    title: "CHANX's Blog",
    description: 'More ideas,more tries.',
    // dest: 'public',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['script', { type: 'text/javascript', src: '/assets/js/baidu.js' }],
    ],
    theme: 'reco',
    themeConfig: {
        type: 'blog',
        // 博客设置
        blogConfig: {
            category: {
                location: 2, // 在导航栏菜单中所占的位置，默认2
                text: 'Category' // 默认 “分类”
            },
            tag: {
                location: 3, // 在导航栏菜单中所占的位置，默认3
                text: 'Tag' // 默认 “标签”
            }
        },
        authorAvatar: '/avatar.png',
        // 最后更新时间
        lastUpdated: 'Last Updated', // string | boolean
        // 作者
        author: 'CHANX',
        // 项目开始时间
        startYear: '2020',
        nav: navConf,
        // sidebar: sidebarConf,
        // logo: '/head.png',
        // 搜索设置
        search: true,
        searchMaxSuggestions: 10,
        // 自动形成侧边导航
        // sidebar: 'auto',
        // 备案
        record: '粤ICP备20036386号-1',
        recordLink: 'http://www.beian.miit.gov.cn/',
        cyberSecurityRecord: '公安部备案文案',
        cyberSecurityLink: '公安部备案指向链接',
    },
    markdown: {
        lineNumbers: true
    },
    plugins: pluginsConf
}