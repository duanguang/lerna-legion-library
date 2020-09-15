# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.5](https://github.com/duanguang/lerna-legion-library/compare/legions-thirdparty-plugin@0.1.0...legions-nprogress@0.0.2) (2020-09-10)

### Bug Fixes

- 修复在 iframe 中获取父级全局变量值时因跨域导致异常,中断脚本执行行为,导致无法正常加载模块

## [0.0.6](https://github.com/duanguang/lerna-legion-library/compare/legions-thirdparty-plugin@0.1.0...legions-nprogress@0.0.2) (2020-09-11)

### Bug Fixes

- 修复插件数据监听机制，主动轮询变为被动订阅机制

## [0.0.7](https://github.com/duanguang/lerna-legion-library/compare/legions-thirdparty-plugin@0.1.0...legions-nprogress@0.0.7) (2020-09-15)

### Bug Fixes

- 修复在节点和值都不存在时才去请求插件，导致在并发环境中,其中一个请求已经创建节点请求资源,但资源还未回来，导致条件判定不成立，误认为已经有值，直接取值导致异常，
