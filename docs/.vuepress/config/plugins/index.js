module.exports = {
    '@vuepress/medium-zoom': {
        selector: '.theme-reco-content:not(a) img',
        options:{
            background:'#fff',
        }
        
    },
    '@vuepress/plugin-active-header-links':{},
    '@vuepress/plugin-nprogress':{},
    'flowchart': {

    },
    // "vuepress-plugin-auto-sidebar": {
    //     // collapsable: true,
    //     // titleMode: "titlecase",
    // },
    "vuepress-plugin-baidu-autopush":{

    },
    'sitemap': {
        hostname: 'https://www.chanx.tech'
    },
    "dynamic-title":{
        showIcon: "/favicon.ico",
        showText: "(/≧▽≦/)欢迎回来！",
        hideIcon: "/favicon.ico",
        hideText: "(●—●)哦吼,不要走！",
        recoverTime: 2000
    }
}