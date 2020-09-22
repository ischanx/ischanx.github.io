const themeConfig = require('./config/theme/index.js')
const navConf = require('./config/nav/index')
const sidebarConf = require('./config/sidebar/index')
const pluginsConf = require('./config/plugins/index')
module.exports = {
    title: "CHANX's Blog",
    description: '陈小白の博客',
    // dest: 'public',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "CHANX"}],
        ['meta', { name: 'keywords', content: 'chanx,chanxblog,陈小白の博客,前端,后台,tech,blog,vuepress-blog' }],
        // ['script', { type: 'text/javascript', src: '/assets/js/baidu.js' }],
        ['script', {}, `
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?a949a9b30eb86ac0159e735ff8670c03";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);

                // 引入谷歌,不需要可删除这段
                var hm1 = document.createElement("script");
                hm1.src = "https://www.googletagmanager.com/gtag/js?id=UA-169923503-1";
                var s1 = document.getElementsByTagName("script")[0]; 
                s1.parentNode.insertBefore(hm1, s1);
            })();

            // 谷歌加载,不需要可删除
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-169923503-1');
        `],
        ['script', {"data-ad-client":"ca-pub-6661696030972028",async:true,src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"}, ``],
        ['script',{src:"/assets/js/jq3.5.1.js"}, ``],
        ['script',{src:"/assets/js/mouse.js"}, ``],
        
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
            appId: process.env.VALINEID,// your appId
            appKey: process.env.VALINEKEY, // your appKey
            recordIP:true,
            placeholder:'填写邮箱地址可以及时收到回复噢...',
            visitor:true,
        },
        authorAvatar: '/avatar.png',
        // 最后更新时间
        lastUpdated: '上次更新时间', // string | boolean
        repo: 'Mr-CHANX/mr-chanx.github.io',
        // 如果你的文档不在仓库的根部
        docsDir: 'docs',
        // 可选，默认为 master
        docsBranch: 'source',
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页！',
        // 作者
        author: 'CHANX',
        // 项目开始时间
        startYear: '2019',
        nav: navConf,
        // sidebar: sidebarConf,
        // logo: '/head.png',
        // 搜索设置
        search: true,
        searchMaxSuggestions: 10,
        // 自动形成侧边导航
        sidebar: 'auto',
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
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
            {
                title: 'YOYLING.',
                desc: '大道至简 大简至极',
                logo: "https://yoyling.com/favicon.png",
                link: 'https://yoyling.com'
            },
            {
                title: 'CZM',
                desc: '菜鸟明De博客',
                logo: "https://images.cnblogs.com/cnblogs_com/chzhm/1750023/o_200916140121timg.jpg",
                link: 'https://czmderepository.github.io/'
            },
            {
                title: 'Liang的个人博客',
                desc: 'Liang的个人博客',
                logo: "https://liang5757.github.io/img/avatar.jpg",
                link: 'https://liang5757.github.io/'
            },
        ]
    },
    markdown: {
        lineNumbers: true
    },
    plugins: pluginsConf
}