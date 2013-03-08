package me.kafeitu.demo.activiti.process;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
//import java.sql.Connection;
//import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import javax.sql.DataSource;

import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;

import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
//import org.activiti.engine.impl.context.Context;
//import org.activiti.engine.impl.db.DbSqlSession;
//import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;

/**
 * 测试请假流程定义
 * 
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class ProcessTestDispatch extends SpringTransactionalTestCase {

  @Autowired
  private RepositoryService repositoryService;

  @Autowired
  private RuntimeService runtimeService;

  @Autowired
  private TaskService taskService;

  @Autowired
  private HistoryService historyService;

  @Autowired
  private FormService formService;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  /**
   * 100%的通过率
   */
  @Test
  public void testRatePercent100() throws Exception {
    testRate(100, 3);
  }

  /**
   * 70%的通过率
   */
  @Test
  public void testRatePercent70() throws Exception {
    testRate(70, 3);
  }

  /**
   * 50%的通过率
   */
  @Test
  public void testRatePercent50() throws Exception {
    testRate(50, 2);
  }

  /**
   * 加签
   
  @Test
  public void testAddNewUser() throws Exception {
    deployResources();

    // 启动流程
    Map<String, String> variableMap = new HashMap<String, String>();

    variableMap.put("countersignUsers", "user1,user2,user3,user4");
    variableMap.put("rate", "100");
    variableMap.put("incept", "国务院");
    variableMap.put("content", "民主制");

    ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionKey("dispatch").singleResult();
    assertNotNull(processDefinition);
    ProcessInstance processInstance = formService.submitStartFormData(processDefinition.getId(), variableMap);
    assertNotNull(processInstance.getId());

    // 验证任务实例
    List<Task> list = taskService.createTaskQuery().processInstanceId(processInstance.getId()).list();
    assertEquals(4, list.size());
    Task originTask = list.get(0);

    // 验证历史任务数量
    long count = historyService.createHistoricTaskInstanceQuery().count();
    assertEquals(4, count);

    Task newTask = taskService.newTask();
    newTask.setAssignee("user5");
    newTask.setName(originTask.getName());
    taskService.saveTask(newTask);
    
    // 加签
    Connection connection = jdbcTemplate.getDataSource().getConnection();
    PreparedStatement pst = connection
            .prepareStatement("update act_ru_task art set EXECUTION_ID_ = ?, PROC_INST_ID_ = ?, PROC_DEF_ID_  = ?, TASK_DEF_KEY_ = ?, SUSPENSION_STATE_ = ? where ID_ = ?");
    pst.setString(1, originTask.getExecutionId());
    pst.setString(2, originTask.getProcessInstanceId());
    pst.setString(3, originTask.getProcessDefinitionId());
    pst.setString(4, originTask.getTaskDefinitionKey());
    pst.setString(5, "1");
    pst.setString(6, newTask.getId());
    int executeUpdate = pst.executeUpdate();
    assertEquals(1, executeUpdate);

    // 加签收验证
    count = historyService.createHistoricTaskInstanceQuery().count();
    assertEquals(5, count);

  }*/

  /**
   * 测试通过率通用方法
   * 
   * @param rate
   *          通过比例
   * @param agreeCounter
   *          通过计数器
   */
  private void testRate(Integer rate, Integer agreeCounter) throws Exception {
    deployResources();

    // 启动流程
    Map<String, String> variableMap = new HashMap<String, String>();

    variableMap.put("countersignUsers", "user1,user2,user3,user4");
    variableMap.put("rate", rate.toString());
    variableMap.put("incept", "国务院");
    variableMap.put("content", "民主制");

    ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionKey("dispatch").singleResult();
    assertNotNull(processDefinition);
    ProcessInstance processInstance = formService.submitStartFormData(processDefinition.getId(), variableMap);
    assertNotNull(processInstance.getId());

    // 验证任务实例
    List<Task> list = taskService.createTaskQuery().list();
    assertEquals(4, list.size());

    // 全部通过
    for (Task task : list) {
      try {
        variableMap = new HashMap<String, String>();
        formService.submitTaskFormData(task.getId(), variableMap);
      } catch (Exception e) {
        // 其他的三个执行完成了，所以最后一个任务（也就是第4个）会报错任务不存在，因为剩下的任务由引擎自动完成了
        // e.printStackTrace();
      }
    }

    long count = historyService.createHistoricTaskInstanceQuery().finished().count();
    assertEquals(4, count);
    assertEquals(agreeCounter, runtimeService.getVariable(processInstance.getId(), "agreeCounter"));

    // 验证是否到达“下发文件”节点
    Task sendTask = taskService.createTaskQuery().taskName("下发文件").singleResult();
    assertNotNull(sendTask);
  }

  /**
   * 部署流程资源：bpmn、form
   */
  private void deployResources() throws FileNotFoundException {
    // 部署流程
    String processFilePath = this.getClass().getClassLoader().getResource("diagrams/dispatch/dispatch.bpmn").getPath();
    FileInputStream inputStream = new FileInputStream(processFilePath);
    assertNotNull(inputStream);
    repositoryService.createDeployment().addInputStream("dispatch.bpmn20.xml", inputStream).deploy();
  }

}
