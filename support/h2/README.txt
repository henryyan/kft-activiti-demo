使用命令启动H2数据库服务，对应脚本：

1. h2-console.[sh|bat] -> 启动H2数据库控制台，
    在JDBC URL中输入：jdbc:h2:file:~/kft-activiti-demo;AUTO_SERVER=TRUE 后可以连接DEMO的默认数据库
2. h2-server.[sh|bat] -> 作为Server启动服务