# 简介

本项目旨在让初学者快速入门Activiti。

**作者**：[咖啡兔](http://www.kafeitu.me)

**项目主页**：[http://www.kafeitu.me/activiti/2012/05/26/kft-activiti-demo.html](http://www.kafeitu.me/activiti/2012/05/26/kft-activiti-demo.html)

**在线演示**：[http://demo.kafeitu.me:8080/kft-activiti-demo](http://demo.kafeitu.me:8080/kft-activiti-demo)

**Wiki文档**: [https://github.com/henryyan/kft-activiti-demo/wiki](https://github.com/henryyan/kft-activiti-demo/wiki)

**QQ群在线支持：**: 236540304

**《Activiti实战》**：Activiti项目Team Leader **Tijs Rademakers**认可并推荐，详情访问 [http://www.kafeitu.me/activiti-in-action.html](http://www.kafeitu.me/activiti-in-action.html)

----
![](https://raw.githubusercontent.com/henryyan/kft-activiti-demo/master/src/main/webapp/images/activiti-in-action.jpg)

----
去 <a href="http://product.china-pub.com/3770832" style="font-size:17pt;color:red">China-Pub</a>| <a href="http://item.jd.com/11599588.html" style="font-size:17pt;color:red">京东</a>| <a href="http://product.dangdang.com/23622065.html" style="font-size:17pt;color:red">当当网</a>| <a href="http://www.amazon.cn/Activiti%E5%AE%9E%E6%88%98-%E9%97%AB%E6%B4%AA%E7%A3%8A/dp/B00RRCOYAQ/ref=sr_1_4?ie=UTF8&qid=1420773978&sr=8-4&keywords=activiti" style="font-size:17pt;color:red">亚马逊</a> 购买
----

# 框架版本

* Activiti: **5.19.0**

* Spring: **4.1.5.RELEASE**

# 分支选择

Demo提供Maven版本和no-maven版本，分别适用于会用mavne和不会用maven的同学。

* **maven**分支：对应与git的`master`分支，便于安装和数据库初始化
* **no-maven**分支：直接是一个eclipse工程，包含eclipse的项目配置文件和WEB-INF/lib下面的所有的jar文件

## Maven方式运行

> mvn clean jetty:run

在 **pom.xml** 中配置了 **h2** 数据库与 **mysql** 数据库，默认启用 **h2** 数据库配置方式，如果使用 **mysql** 请启用mysql的配置(使用下面的命令)。

> mvn clean jetty:run -Pmysql

# 演示说明文档

* [配置说明](https://github.com/henryyan/kft-activiti-demo/wiki/%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E)
* [功能演示](https://github.com/henryyan/kft-activiti-demo/wiki/%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA)
 
![kft-activiti-demo截图](http://www.kafeitu.me/files/2012/05/kft-activiti-demo.png)

## Changelog

### 1.14.0（2015-11-26）
1. 添加查看引擎参数功能
2. 添加查看引擎数据库功能
3. 添加管理用户与组功能
4. 添加作业管理功能
5. 5.17+方式嵌入Rest服务

### 1.13.0（2015-11-23）
1. 集成基于5.17+的流程设计器(Activiti Modeler,很漂亮),demo依赖的版本支持5.17以上
2. 数据库配置属性转移到pom.xml里面,可以直接修改`pom.xml`文件的参数,也可以在运行时通过`-Djdbc.password=111111`参数覆盖

### 1.11~1.12(unknown)
1. 内部消耗掉了，不要问我...

### 1.10.1（2014-04-23）
1. 修复在最新版本Chrome（V34）不能运行Activiti Modeler问题

### 1.10.0（2014-04-18）
1. 集成了diagram-viewer，目前提供了三种流程跟踪方式
2. 添加了针对JPA的演示
3. 添加了全局监听的演示
4. 使用5.15.1-kft版本（修复了5.15版本中查询待办任务<包含指定到人、候选人、候选组>方法的Bug）

### 1.9.0（2014-01-01）
1. 升级Activiti到5.14
2. 同时支持纯Rest接口和Activiti Modeler的Rest路径映射

### 1.8.0（2013-06-22）
1. 升级Activiti至5.13
2. 移除了全局监听器（以后的版本会再加入）

### 1.7.2（2013-04-17）
1. 升级Activiti至5.12.1-kft版本
2. 添加全局监听器演示

### 1.7.1（2013-04-10）
1. 解决流程引擎自动生成的图片跟踪坐标错乱问题
2. 使用重新打包的5.12.1，解决JDK6部署时报错问题
3. 解决跟踪流程图时（调用引擎的图片生成工具）中文乱码

### 1.7.0（2013-03-10）
1. 添加分页查询演示
2. 添加流程定义对象(ProcessDefinition)缓存演示, see: [Tweaking the process definition cache in Activiti 5.12](http://www.jorambarrez.be/blog/2012/12/20/tweaking-process-definition-cache/)
3. 添加activityFontName属性配置，可以解决流程图中包含中文导致生成的流程图乱码问题
4. 整合Activiti Modeler，可以在线设计流程

> 特别说明：5.12.1不是官方提供，是我自己打包的一个版本（支持Native Query分页查询功能，5.13将会直接提供此功能）

### 1.6.0（2013-01-06）
1. 添加多实例（发文）演示
2. 添加自动部署流程定义演示

### 1.5.0 (2012-12-16)
1. 13fc350 添加对流程定义状态的控制功能
2. c50ec09 添加流程实例状态控制功能
3. 9a97cda formkey查询任务时使用native query
4. 3e8ab24 清理垃圾
5. 9035e56 动态表单和外置表单的运行中列表显示的当前节点的英文名称，并在查询流程数据时区分动态、外置表单
6. 7f955c4 重写JuelFormEngine，解决windows平台读取表单内容乱码问题
7. d72778b 升级portlet插件为1.1.1
8. 5e4007c 升级初始化sql的activiti版本为5.11
9. 684c8a0 解决jsp文件中出现两个head问题
10. 3bcbd56 菜单的传统改为普通，外部改为外置
11. 645347c 移除不需要的依赖版本号

### 1.4.1 (2012-12-01)

1.升级jquery.portlet.js解决把一列的portlet拖走后不能再拖回问题

2.升级:jquery -> 1.83，jquery ui -> 1.9.2, jquery.layout -> 1.3，html头部声明用html标准代替xhtml

### 1.4 (2012-11-27)

1.表单名称重构，portlet添加关于作者和表单概念模块

2.首页用jquery.portlet插件显示信息，并添加一个待办任务列表的portlet

2. c50ec09 添加流程实例状态控制功能
3. 9a97cda formkey查询任务时使用native query
4. 3e8ab24 清理垃圾
5. 9035e56 动态表单和外置表单的运行中列表显示的当前节点的英文名称，并在查询流程数据时区分动态、外置表单
6. 7f955c4 重写JuelFormEngine，解决windows平台读取表单内容乱码问题
7. d72778b 升级portlet插件为1.1.1
8. 5e4007c 升级初始化sql的activiti版本为5.11
9. 684c8a0 解决jsp文件中出现两个head问题
10. 3bcbd56 菜单的传统改为普通，外部改为外置
11. 645347c 移除不需要的依赖版本号

### 1.4.1 (2012-12-01)

1.升级jquery.portlet.js解决把一列的portlet拖走后不能再拖回问题

2.升级:jquery -> 1.83，jquery ui -> 1.9.2, jquery.layout -> 1.3，html头部声明用html标准代替xhtml

### 1.4 (2012-11-27)

1.表单名称重构，portlet添加关于作者和表单概念模块

2.首页用jquery.portlet插件显示信息，并添加一个待办任务列表的portlet

### 中间的版本没记录就忽略了。。。

### 1.0.0（2011-10-23）鼻祖

1. 第一个原始版本，当时应该只有流程部署和流程启动。。。
