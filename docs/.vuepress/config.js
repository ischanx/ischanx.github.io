const themeConfig = require('./config/theme/index.js')
const navConf = require('./config/nav/index')
const sidebarConf = require('./config/sidebar/index')
const pluginsConf = require('./config/plugins/index')
module.exports = {
    title: "CHANX's Blog",
    description: '理想很丰满的小陈同学',
    // dest: 'public',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['script', { type: 'text/javascript', src: '/assets/js/baidu.js' }],
    ],
    theme: 'reco',
    themeConfig: {
        type: 'blog',
        smoothScroll: true,
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
        valineConfig: {
            appId: 'WDOa3anONgcA8zAgpDghKeSv-9Nh9j0Va',// your appId
            appKey: 'emlMPDhG39GxfHfM4q9RvOMA', // your appKey
            recordIP:true,
            placeholder:'小陈同学需要你的评论...',
            visitor:true,
        },
        authorAvatar: '/avatar.png',
        // 最后更新时间
        lastUpdated: '上次更新时间', // string | boolean
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
        cyberSecurityRecord: '粤公网安备 44060602001609号',
        cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44060602001609',
        friendLink: [
            {
                title: '午后南杂',
                desc: 'Enjoy when you can, and endure when you must.',
                email: '1156743527@qq.com',
                link: 'https://www.recoluan.com'
            },
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
        ]
    },
    markdown: {
        lineNumbers: true
    },
    plugins: pluginsConf
}