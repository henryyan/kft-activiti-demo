create database if not exists kad  default character set =utf8 default collate=utf8_general_ci;
use kad;
drop table if exists OA_LEAVE;
create table OA_LEAVE 
(
    ID                   BIGINT not null  AUTO_INCREMENT comment 'ID',
    PROCESS_INSTANCE_ID  VARCHAR(64) comment '流程ID',
    USER_ID              VARCHAR(20) not null comment '工号',
    START_TIME           TIMESTAMP not null comment '开始时间',
    END_TIME             TIMESTAMP not null comment '结束时间',
    LEAVE_TYPE           VARCHAR(20) comment '假种',
    REASON               VARCHAR(2000) comment '请假事由',
    APPLY_TIME           TIMESTAMP not null comment '申请时间',
    REALITY_START_TIME   TIMESTAMP comment '实际开始时间',
    REALITY_END_TIME     TIMESTAMP comment '实际结束时间',
    constraint PK_OA_LEAVE primary key (ID)
) comment '请假';
