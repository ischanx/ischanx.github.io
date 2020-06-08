module.exports = {
    '@vuepress/medium-zoom': {

    },
    'flowchart': {

    },
    "vuepress-plugin-auto-sidebar": {
        // collapsable: true,
        // titleMode: "titlecase",
    },
    "vuepress-plugin-baidu-autopush":{

    },
    'sitemap': {
        hostname: 'https://www.chanx.tech'
    },
    '@vuepress/medium-zoom': {
        selector: 'img.zoom-custom-imgs',
        // medium-zoom options here
        // See: https://github.com/francoischalifour/medium-zoom#options
        options: {
            margin: 16
        }
    },
    "dynamic-title":{
        showIcon: "/favicon.ico",
        showText: "(/≧▽≦/)欢迎回来！",
        hideIcon: "/favicon.ico",
        hideText: "(●—●)哦吼,不要走！",
        recoverTime: 2000
    }
}