export const site = {
  title: "Chanx's Blog",
  description: "前端开发 | 陈同学技术博客 | 代码破破烂烂我在缝缝补补",
  typewriter: ['哈喽，好久不见', 'JavaScript', 'React.js', 'Vue.js', 'TypeScript', 'Node.js', 'AI', 'LLM', 'Prompt', 'Agent'],
  keywords: "chanx, ischanx, chanxblog, 前端开发, web, tech, blog, astro, 程序员, 技术博客, 个人博客",
  author: "Chanx",
  email: "ischanx@foxmail.com",
  avatar: "/img/avatar.png",
  url: "https://chanx.tech",
  language: "zh-CN",
  timezone: "Asia/Shanghai",
  // 首页设置
  indexSettings: {
    perPage: 10,
    orderBy: 'createDate',
    sticky: {
      enable: true,
      icon: "pin",
      text: "置顶"
    }
  },
  socialLinks: [
    { icon: "github", link: "https://github.com/ischanx", target: "_blank" },
    { icon: "twitter", link: "https://x.com/ischanx8", target: "_blank" },
    { icon: "mail", link: "mailto:ischanx@foxmail.com" }
  ],
  nav: [
    { text: "首页", link: "/", icon: "home" },
    { text: "归档", link: "/archives", icon: "clock" },
    { text: "分类", link: "/categories", icon: "category" },
    { text: "关于", link: "/about", icon: "user" },
    { text: "友链", link: "/links", icon: "link" },
    {
      text: "RSS",
      icon: "rss",
      link: "/atom.xml",
      target: "_blank"
    }
  ],
  footer: {
    content: '© 2019 - {currentYear} Chanx | Powered by Astro',
    startTime: '2019-01-01',
    showRunningTime: true,
    beian: {
      enable: true,
      icp: "粤ICP备20036386号",
      police: "粤公网安备44060602001609号",
      policeCode: "44060602001609",
      policeIcon: "/img/police_beian.png"
    }
  },
  sticky: {
    enable: true,
    icon: "pin",
    text: "置顶"
  },
  theme: {
    darkMode: {
      enable: true,
      default: "auto"
    },
    color: {
      primary: "#2563eb",
      secondary: "#60a5fa",
      background: "#f8fafc",
      text: "#0f172a",
      dark: {
        background: "#171717",
        text: "#f8fafc"
      }
    }
  },
  features: {
    search: {
      enable: true
    },
    toc: {
      enable: true,
      placement: "right",
      headingSelector: "h1,h2,h3,h4,h5,h6",
      collapseDepth: 2
    },
    code: {
      copy: true,
      lineNumber: true,
      highlight: true
    },
    comments: {
      enable: true,
      type: "giscus",
      giscus: {
        repo: "ischanx/ischanx.github.io",
        repoId: "MDEwOlJlcG9zaXRvcnkyNTkxODA5Njc=",
        category: "Announcements",
        categoryId: "DIC_kwDOD3LJp84CXbNd",
        themeLight: "light",
        themeDark: "dark",
        mapping: "title",
        reactionsEnabled: 1,
        emitMetadata: 0,
        inputPosition: "top",
        lang: "zh-CN"
      }
    }
  },
  // SEO相关配置
  seo: {
    // 是否使用强化SEO功能
    enable: true,
    // 默认图片（当文章没有设置封面图时使用）
    defaultImage: "/default-cover.jpg",
    // 站点Logo（用于结构化数据）
    logo: "/logo.png",
    // 站点默认类型
    defaultType: "website",
    // 社交媒体信息
    social: {
      twitter: "@ischanx8",
      facebook: ""
    },
    // 额外的结构化数据
    schema: {
      // 网站发布者信息（Person或Organization）
      publisher: {
        type: "Person",
        name: "Chanx",
        logo: "/avatar.png"
      },
      // 网站类型
      siteType: "Blog",
    },
    // 额外的meta标签
    extraMeta: [
      { name: "referrer", content: "no-referrer-when-downgrade" },
      { name: "google-adsense-account", content: "ca-pub-6661696030972028" },
      // { name: "baidu-site-verification", content: "code-xxxxxxxxxxxx" }
    ]
  },
  analytics: {
    umami: {
      enable: true,
      websiteId: "46b25fe7-e42b-4a02-abe8-9a92b78fc8c0", // 替换为你的 Umami 网站 ID
      scriptUrl: "https://umami.showmecode.net/script.js", // Umami 脚本地址，如果是自建可能需要修改
      domains: "chanx.tech", // 可选，跟踪的域名
      autoTrack: true, // 可选，自动跟踪页面浏览
      respectDoNotTrack: true // 可选，尊重 Do Not Track 设置
    }
  }
};

export const links = {
  items: [
    {
      title: "午后南杂",
      intro: "Enjoy when you can, and endure when you must.",
      link: "https://www.recoluan.com/",
      avatar: "https://www.recoluan.com/head.png"
    },
    {
      title: "RawChen · Blog",
      intro: "大道至简 大简至极",
      link: "https://rawchen.com/",
      avatar: "https://rawchen.com/favicon.png"
    },
    {
      title: "Liang的个人博客",
      intro: "某大厂前端工程师",
      link: "https://liang5757.github.io/",
      avatar: "https://liang5757.github.io/img/avatar.jpg"
    },
    {
      title: "菜鸟明De博客",
      intro: "某大厂后端工程师",
      link: "https://czmderepository.github.io/",
      avatar: "https://s1.ax1x.com/2020/09/17/wRG4fS.jpg"
    },
    {
      title: "谈笑风生间",
      intro: "博观而约取，厚积而薄发",
      link: "https://anyview.fun/",
      avatar: "https://makonike-blog.oss-cn-guangzhou.aliyuncs.com/blog/title/avatar1.png"
    },
    {
      title: "逆流的博客",
      intro: "种一棵树最好的时间是十年前，其次是现在",
      link: "http://blog.fansqz.com/",
      avatar: "https://blog.fansqz.com/img/head.jpg"
    },
    {
      title: "ObjectX-不知名程序员",
      intro: "热爱生活和分享技术的前端工程师 & 图形编辑 & AI",
      link: "https://object-x.com.cn/",
      avatar: "https://next-blog.oss-cn-beijing.aliyuncs.com/images/articles/9c1f71c0-ad3a-45b8-8e07-b0e1a2ed8746.jpg"
    },
    {
      title: "Eason Pan",
      intro: "某不知名后端工程师",
      link: "https://panyc0217.github.io",
      avatar: "https://panyc0217.github.io/assets/img/avatar.jpg"
    },
  ],
  custom: {
    enable: true,
    content: '<p>在下方留言申请加入我的友链，按如下格式提供信息：</p><ul><li>博客名：Chanx &#39;s Blog</li><li>简介：想法 + 实践 = Bugs</li><li>链接：https://chanx.tech/</li><li>图片：https://chanx.tech/avatar.png</li></ul>'
  }
}; 
