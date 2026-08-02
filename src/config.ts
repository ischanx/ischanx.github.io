export const categoryMap: Record<string, string> = {
  development: '软件开发',
  ai: 'AI',
  learning: '学习',
  personal: '个人记录',
};

export const categoryDescriptions: Record<string, string> = {
  development: '记录项目实现、系统设计、部署与工程实践。',
  ai: '探索人工智能、Agent 与相关工具的实践。',
  learning: '整理基础知识、原理课程与持续学习记录。',
  personal: '保存生活观察、阶段总结与个人经历。',
};

export const tagMap: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  'full-stack': '全栈',
  ai: 'AI',
  'mini-program': '小程序',
  computer: '计算机',
  fundamentals: '基础知识',
  business: '业务',
  'system-design': '系统设计',
  performance: '性能',
  security: '安全',
  reliability: '稳定性',
  engineering: '工程化',
  'developer-experience': '研发体验',
};

export const site = {
  title: "Chanx's Blog",
  description:
    '记录技术实践与 AI 探索，分享开发中的问题、思考与解决方案。',
  home: {
    hero: {
      greeting: '嗨，我是陈同学。',
      headingPrefix: '在 AI 时代，',
      headingHighlight: '保持好奇心。',
      summary:
        '这里记录我和 AI 一起探索、一起进步的过程',
      conversations: [
        {
          question: '为什么写博客？',
          answer: '因为我想留下的，不只是答案，还有一个问题被想清楚的过程。',
        },
        {
          question: '这里会写些什么？',
          answer: '前端、后端、AI，也写一些技术之外的经历和思考。',
        },
        {
          question: '这个博客写给谁？',
          answer: '先写给自己，也写给刚好在思考同一个问题的人。',
        },
        {
          question: '怎么看待 AI？',
          answer: 'AI 是能力的放大器，而不是人的替代，最终能走多远仍取决于自身的能力和判断。',
        },
        {
          question: 'AI 时代的工程师需要什么？',
          answer: '技术上要有自己的深度，认知上也要有足够的广度，理解上下游链路和整个系统。',
        },
      ],
    },
  },
  keywords: "chanx, ischanx, chanxblog, 前端开发, web, tech, blog, astro, 程序员, 技术博客, 个人博客",
  author: "Chanx",
  email: "ischanx@foxmail.com",
  avatar: "/img/avatar.png",
  url: "https://chanx.tech",
  language: "zh-CN",
  posts: {
    pageSize: 10,
    pinnedBadge: {
      enabled: true,
      icon: "pin",
      label: "置顶",
    }
  },
  socialLinks: [
    { icon: "github", link: "https://github.com/ischanx", target: "_blank" },
    { icon: "twitter", link: "https://x.com/ischanx8", target: "_blank" },
    { icon: "mail", link: "mailto:ischanx@foxmail.com" }
  ],
  navigation: [
    { text: "首页", link: "/", icon: "home" },
    { text: "归档", link: "/archives", icon: "clock" },
    { text: "分类", link: "/categories", icon: "category" },
    { text: "标签", link: "/tags", icon: "tags" },
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
    copyright: '© 2019 - {currentYear} Chanx | Powered by Astro',
    launchedAt: '2019-01-01',
    showUptime: true,
    text: {
      statementTitle: '持续探索，不断记录',
      statementDescription: '这里记录我和 AI 一起探索、一起进步的过程',
      navigationLabel: '页脚导航',
      browseLabel: '浏览',
      connectLabel: '连接',
      archives: '归档',
      categories: '分类',
      about: '关于',
      github: 'GitHub',
      rss: 'RSS',
      email: '邮件',
      runningTime: '已运行',
      calculating: '计算中...',
      backToTop: '返回顶部',
    },
    beian: {
      enabled: true,
      icp: "粤ICP备20036386号",
      police: "粤公网安备44060602001609号",
      policeCode: "44060602001609",
      policeIcon: "/img/police_beian.png"
    }
  },
  comments: {
    enabled: true,
    provider: "giscus",
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
  },
  seo: {
    social: {
      twitter: "@ischanx8",
    },
    metaTags: [
      { name: "referrer", content: "no-referrer-when-downgrade" },
      { name: "google-adsense-account", content: "ca-pub-6661696030972028" },
    ]
  },
  analytics: {
    openpanel: {
      enabled: true,
      apiUrl: "https://data.chanx.app/api",
      clientId: "f070e406-ebd4-47e8-b69a-c3e2dfc428cf",
      trackScreenViews: true,
      trackOutgoingLinks: true
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
    enabled: true,
    html: `<p>想加入朋友圈？请将以下信息发送至 <a href="mailto:${site.email}?subject=${encodeURIComponent('交个朋友')}&body=${encodeURIComponent('博客名：\n简介：\n链接：\n图片：')}">${site.email}</a>：</p><ul><li>博客名：Chanx &#39;s Blog</li><li>简介：想法 + 实践 = Bugs</li><li>链接：https://chanx.tech/</li><li>图片：https://chanx.tech/avatar.png</li></ul><p><a href="mailto:${site.email}?subject=${encodeURIComponent('交个朋友')}&body=${encodeURIComponent('博客名：\n简介：\n链接：\n图片：')}">发封邮件，交个朋友</a></p>`
  }
};
