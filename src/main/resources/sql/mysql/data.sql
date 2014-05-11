insert into ACT_ID_GROUP values ('admin', 1, '管理员', 'security-role');
insert into ACT_ID_GROUP values ('user', 1, '用户', 'security-role');
insert into ACT_ID_GROUP values ('deptLeader', 1, '部门领导', 'assignment');
insert into ACT_ID_GROUP values ('hr', 1, '人事', 'assignment');
insert into ACT_ID_GROUP values ('generalManager', 1, '总经理', 'assignment');

insert into ACT_ID_USER values ('admin', 1, 'Admin', 'Kad', 'admin@kad.com', '000000', '');
insert into ACT_ID_MEMBERSHIP values ('admin', 'user');
insert into ACT_ID_MEMBERSHIP values ('admin', 'admin');

insert into ACT_ID_USER values ('kafeitu', 1, 'Henry', 'Yan', 'yanhonglei@gmail.com', '000000', '');
insert into ACT_ID_MEMBERSHIP values ('kafeitu', 'admin');

insert into ACT_ID_USER values ('hruser', 1, 'Lili', 'Zhang', 'hr@gmail.com', '000000', '');
insert into ACT_ID_MEMBERSHIP values ('hruser', 'user');
insert into ACT_ID_MEMBERSHIP values ('hruser', 'hr');

insert into ACT_ID_USER values ('leaderuser', 1, 'Jhon', 'Li', 'leader@gmail.com', '000000', '');
insert into ACT_ID_MEMBERSHIP values ('leaderuser', 'user');
insert into ACT_ID_MEMBERSHIP values ('leaderuser', 'deptLeader');

insert into ACT_ID_USER values ('generalManager', 1, 'Lone', 'Li', 'leader@gmail.com', '000000', '');
insert into ACT_ID_MEMBERSHIP values ('generalManager', 'generalManager');

update ACT_GE_PROPERTY
set VALUE_ = '12'
where NAME_ = 'next.dbid';