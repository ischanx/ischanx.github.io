---
title: 从 Docker 到 Kubernetes，再到 Telepresence
description: 面向前端团队，梳理 Docker、docker-compose、Kubernetes 与 Telepresence 在研发链路中的位置，建立从本地运行到集群联调的整体认知。
createDate: 2026-04-07T00:00:00.000Z
updateDate: 2026-04-07T00:00:00.000Z
image: ''
tags:
  - 前端工程化
  - Docker
  - Kubernetes
  - Telepresence
category: 前端
draft: false
sticky: false
permalink: /docker-kubernetes-telepresence/
---

## 背景

前端团队在日常研发中经常会接触 Docker、docker-compose、Kubernetes 和 Telepresence。它们分别出现在本地开发、服务联调、测试部署和集群访问等场景里，如果只按工具名分别理解，很容易形成碎片化认知。

更合适的方式，是把它们放到同一条研发链路中看：

```txt
Docker -> docker-compose -> Kubernetes -> Telepresence
```

这条链路背后，其实是运行环境一步步外移、标准化和规模化的过程：

- 传统服务：应用依赖机器环境运行
- Docker：单个应用如何打包和运行
- docker-compose：多个服务如何在本地协同
- Kubernetes：服务如何在集群中稳定运行
- Telepresence：本地开发如何访问集群内网

理解这几个层次，比记住某个命令或配置项更重要。

## 一、传统服务：应用依赖机器环境运行

在没有 Docker 之前，服务通常直接部署在一台机器上。

以一个 Node.js 服务为例，运行它可能需要提前在机器上准备：

- 指定版本的 Node.js
- npm、pnpm 或 yarn
- 系统依赖
- 环境变量
- 启动脚本
- Nginx 或进程守护工具

这种方式的问题不在于不能用，而在于运行结果强依赖机器环境。

本地、测试环境和生产环境只要有一个细节不一致，就可能出现“我本地可以跑，测试环境不行”的问题。比如 Node.js 版本不同、依赖安装方式不同、系统库缺失、环境变量遗漏，或者某个启动脚本只在某台机器上存在。

随着服务数量增加，这类问题会变得更明显：

- 每个服务都要单独准备运行环境
- 新人本地启动成本高
- 环境差异难以排查
- 部署过程依赖机器状态
- 服务迁移到另一台机器时需要重新配置

所以，在传统服务模式下，交付物并不只是代码，还隐含了一整套运行环境和部署步骤。

Docker 要解决的，正是这个问题：把应用和运行环境一起交付。

## 二、Docker：解决单个应用的运行一致性

Docker 关注的是单个应用的构建与运行。

一个典型链路是：

```txt
代码 -> Dockerfile -> Image -> Container
```

其中：

- `Dockerfile` 描述如何构建运行环境
- `Image` 是构建后的静态产物
- `Container` 是镜像运行后的实例

Docker 的核心价值，是把应用和运行环境一起封装。对于前端团队来说，这通常体现在 Node.js 版本、依赖安装、构建工具链、SSR 服务、BFF 服务等环境一致性上。

如果只有一个服务，Docker 基本就能解决运行问题。但真实项目往往不止一个服务。

## 三、docker-compose：解决本地多服务协同

一个前端项目的本地环境，可能同时包含：

- 前端开发服务
- BFF 或 SSR 服务
- API 服务
- Redis
- 数据库
- 反向代理

这时问题就从“一个容器怎么运行”，变成了“一组服务如何一起运行”。

docker-compose 的定位，就是在单机上组织多个容器。它通过 `docker-compose.yml` 描述服务、端口、环境变量、网络、挂载目录和依赖关系。

可以把它简化为：

```txt
project -> services -> containers
```

因此，docker-compose 更适合被理解为“本地项目环境组织工具”，而不是生产部署平台。

它很好地解决了本地联调的启动成本问题，但它的边界也很清楚：它主要面向单机环境，不负责多节点调度、自动恢复、滚动发布、服务发现和生产级流量治理。

这些是 Kubernetes 要解决的问题。

## 四、Kubernetes：解决集群中的运行与治理

Kubernetes 和 docker-compose 的差异，不只是“更复杂”，而是问题域不同。

```txt
docker-compose：单机视角的多服务组织
Kubernetes：集群视角的服务运行与治理
```

Kubernetes 关心的不只是把服务启动起来，还包括：

- 服务应该运行多少个副本
- 副本应该调度到哪些节点
- 实例故障后如何自动恢复
- 发布时如何滚动升级
- 服务之间如何发现彼此
- 外部流量如何进入集群
- 配置、密钥、存储如何管理

对于前端团队来说，不需要一开始就记住所有 Kubernetes 资源。先抓住两条主链路就够了。

## 五、Kubernetes 的两条核心链路

第一条是运行链路：

```txt
Deployment -> Pod -> Container
```

第二条是访问链路：

```txt
Ingress -> Service -> Pod
```

### 运行链路

Container 仍然是实际运行代码的单元，但 Kubernetes 不直接以单个 Container 作为调度对象，而是使用 Pod。

Pod 是 Kubernetes 中最小的部署和调度单元。它可以包含一个或多个 Container，并提供共享网络、共享存储和统一生命周期。

业务服务通常是一个 Pod 里运行一个主业务 Container。多 Container Pod 更多用于 sidecar、init container 等强耦合辅助场景。

Deployment 则负责声明和维持 Pod 的期望状态，例如：

- 需要几个副本
- 使用哪个 Pod 模板
- 如何滚动升级
- 如何回滚

简单说：

```txt
Container 是进程运行单元
Pod 是集群调度单元
Deployment 是期望状态管理
```

### 访问链路

Pod 会因为发布、扩缩容、故障恢复而被重建，所以 Pod IP 不适合作为稳定访问地址。

Service 的作用，是为一组 Pod 提供稳定入口，并在多个副本之间分发流量。

Ingress 则负责定义外部流量如何进入集群，例如按域名或路径路由到不同 Service。

一个典型请求路径是：

```txt
Browser -> Ingress -> Service -> Pod -> Container
```

这条链路能帮助前端开发理解：域名、网关、服务入口和实际应用实例之间到底是什么关系。

### 集群内部网络与服务发现

Kubernetes 还有一个很重要的前提：集群内部有自己的网络和服务发现机制。

Pod 在集群中会获得自己的 IP，不同 Pod 之间可以通过集群网络互相访问。但 Pod 本身不是稳定对象，发布、扩缩容或故障恢复都会让 Pod 被销毁再创建，Pod IP 也会随之变化。

所以服务之间通常不会直接调用某个 Pod IP，而是调用 Service。

Service 会通过 selector 关联一组 Pod，并提供一个稳定的访问入口。调用方访问 Service，Kubernetes 再把流量转发到后面的 Pod。

同时，Kubernetes 会为 Service 提供 DNS 记录。假设有一个服务叫 `user-service`，位于 `dev` namespace 内，集群内通常可以通过下面的名称访问：

```txt
user-service
user-service.dev
user-service.dev.svc.cluster.local
```

它们分别适用于不同的调用场景：

- 同一个 namespace 内，通常可以直接访问 `user-service`
- 跨 namespace 访问时，通常使用 `user-service.dev`
- 完整域名则是 `user-service.dev.svc.cluster.local`

这也是为什么集群里的服务可以直接用服务名互相调用，而本地机器通常不行。本地既不在 Kubernetes 集群网络里，也不会默认使用 Kubernetes 的内部 DNS。

## 六、把三者放回同一张图

到这里，核心关系可以合并成两条线：

```txt
代码
  -> Dockerfile
  -> Image
  -> Container
  -> Pod
  -> Deployment

外部请求
  -> Ingress
  -> Service
  -> Pod
  -> Container

集群内部请求
  -> Service DNS
  -> Service
  -> Pod
  -> Container
```

第一条描述应用如何从代码变成集群里的运行实例，第二条描述外部请求如何进入服务，第三条描述集群内部服务之间如何互相发现和访问。

## 七、前端团队的真实痛点：本地如何访问集群内网

对前端团队来说，Kubernetes 最常见的问题往往不是如何写 Deployment，而是本地联调时的网络边界。

典型场景是：

- 前端代码在本地运行
- API 或 BFF 运行在 Kubernetes 集群里
- 依赖服务只暴露在集群内网
- 本地机器无法解析或访问这些内部服务

例如集群内可以访问：

```txt
http://user-service.dev
```

但本地机器通常会遇到两个问题：

- 无法解析 Kubernetes 内部 DNS
- 不在集群网络中，无法连通内部 Service

所以问题不只是“知道服务名”，而是本地开发环境是否真正接入了集群网络。

一种常见做法是使用 `kubectl port-forward`，把集群里的某个 Service 或 Pod 端口转发到本地端口。例如：

```sh
kubectl port-forward svc/user-service 8080:80 -n dev
```

这样本地可以通过 `localhost:8080` 访问目标服务。它适合临时排查单个服务，但用于日常联调会比较笨重：

- 每个服务都要单独转发
- 本地代码里要改成 `localhost` 地址
- 多个依赖服务会产生一组端口映射
- 转发进程断开后需要重新启动

当本地应用需要访问一组集群内服务时，`port-forward` 更像是点对点补洞，而不是完整接入集群网络。

## 八、Telepresence：把本地开发机接入集群网络

Telepresence 补上的正是这段断层。

它的定位可以概括为：

```txt
让本地开发机像在集群内一样访问 Kubernetes 内部服务。
```

例如：

```sh
telepresence connect -n dev
```

连接后，本地通常会获得两类能力：

- 集群内部服务名解析
- 到集群内部服务的网络连通

这两点必须同时存在。只有 DNS 解析，没有网络连通，服务仍然访问不了；只有网络连通，没有集群 DNS，也很难使用 Kubernetes 的服务发现体系。

有了 Telepresence，本地服务可以继续使用集群里的服务名访问依赖，而不需要给每个服务单独转发端口，也不需要把内部服务暴露到公网。

研发模式就变成了：

```txt
Local Development -> Telepresence -> Cluster Network -> Internal Services
```

这对前端联调很实用：代码仍然在本地跑，依赖却可以直接使用真实集群环境。

## 九、一个实际例子：配置下发链路

可以用配置下发来串一下前面的概念。

假设团队里有一个 `config-server`，负责统一管理服务运行时配置。配置来源通常分成两类：

- 运维维护的业务 yaml，例如域名、环境标识、开关、灰度规则等
- 开发维护的服务 yaml，例如服务自身依赖、模块参数、接口地址等

这些配置会统一汇入 `config-server`：

```txt
运维 -> 业务 yaml ┐
                 -> config-server
开发 -> 服务 yaml ┘
```

业务服务启动时，不会把所有配置都硬编码在代码里，而是在启动阶段加载配置模块。一个简化后的链路如下：

```txt
服务启动
  -> 加载 ConfigModule
  -> loadRemoteConfig
  -> 请求 http://config-server/content/:service
  -> 获得拼装后的 yaml
  -> parse 转成 json
  -> 保存到 configService
  -> 业务代码使用
```

这里有几个关键点。

第一，`config-server` 通常是集群内部服务。部署在 Kubernetes 里的业务服务，可以通过 Service 名称直接访问它，例如：

```txt
http://config-server/content/user-service
```

第二，配置拉取发生在服务启动阶段。如果本地启动 BFF 或 Node 服务时也要走同一套配置链路，那么本地进程同样需要访问集群内的 `config-server`。

第三，这时问题就回到了前面说的网络边界：本地能不能解析 `config-server`，能不能连到它。

如果用 `port-forward`，可以把 `config-server` 转发到本地端口：

```sh
kubectl port-forward svc/config-server 8080:80 -n dev
```

然后本地配置地址改成：

```txt
http://localhost:8080/content/user-service
```

这种方式能跑通，但它改变了本地配置地址，也只处理了这一个服务。如果业务启动时还要访问鉴权服务、网关服务或其他内部依赖，就会继续增加端口转发和本地配置差异。

使用 Telepresence 后，本地服务可以保留和集群内一致的访问方式：

```txt
http://config-server/content/user-service
```

也就是说，本地进程虽然运行在开发机上，但配置加载链路更接近集群内运行状态：

```txt
Local BFF
  -> ConfigModule
  -> config-server
  -> configService
  -> Business Code
```

这个例子能说明 Telepresence 的价值：它不是单纯为了“访问某个接口”，而是让本地运行的服务尽量复用集群里的服务发现、配置下发和内部依赖关系。

## 总结

回到前端团队的日常研发，可以记住几条主链路：

```txt
构建链路：代码 -> Dockerfile -> Image -> Container
运行链路：Deployment -> Pod -> Container
访问链路：Ingress -> Service -> Pod
联调链路：Local Development -> Telepresence -> Cluster Network
配置链路：ConfigModule -> config-server -> configService
```

理解这些链路的价值，不在于马上成为 Kubernetes 管理者，而是能更准确地判断：应用在哪里运行、请求如何到达服务、本地为什么访问不了集群服务，以及 Telepresence 补上的到底是哪一段网络能力。
