# 简介

本项目旨在让初学者快速入门Activiti。

本项目依赖[Springside4](https://github.com/springside/springside4)。

**作者**：[咖啡兔|http://www.kafeitu.me]

# 框架版本

* Activiti: **5.9**

* Spring: **3.1.1.RELEASE**

* SpringSide：**4.0.0.RC4-SNAPSHOT**

# 运行方式

## 1.克隆并安装Springside4

<pre>
git clone git://github.com/springside/springside4.git
cd springside4
mvn clean install -Dmaven.test.skip=true
</pre>

## 2.启动项目

### 2.1 克隆项目
<pre>
git clone git://github.com/henryyan/kft-activiti-demo.git
</pre>

### 2.2 启动数据库(h2)

#### 2.2.1 Windows用户
<pre>
cd support/h2
h2-server.bat
</pre>

#### 2.2.2 Linux用户
<pre>
cd support/h2
./h2-server.sh
</pre>

## 3.启动系统

本系统使用内置Web Server- Jetty。

<pre>mvn jetty:run</pre>

## 4 初始化数据

### 4.1 Windows用户
<pre>
h2-console.bat
</pre>

### 4.2 Linux用户
<pre>
./h2-console.sh
</pre>

### 4.3 初始化
访问页面：[http://localhost:8090](http://localhost:8090)
在**JDBC URL**中输入：
<pre>jdbc:h2:tcp://localhost/~/kft-activiti-demo</pre>

登录之后找到：
<pre>kft-activiti-demo/src/main/resources/sql/h2/data.sql</pre>

复制里面的SQL语句到文本框点击**Run**。

## 5.访问系统

打开浏览器访问：[http://localhost:8080/kft-activiti-demo](http://localhost:8080/kft-activiti-demo)