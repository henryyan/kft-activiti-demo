package me.kafeitu.demo.activiti.process;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.FileInputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

/**
 * 测试请假流程定义
 * 
 * @author HenryYan
 */
@ContextConfiguration(locations = { "/applicationContext.xml" })
public class ProcessTestDispatch extends SpringTransactionalTestCase {

  @Autowired
  private RepositoryService repositoryService;

  @Autowired
  private RuntimeService runtimeService;

  @Autowired
  private TaskService taskService;

  @Autowired
  private HistoryService historyService;

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
   * 测试通过率通用方法
   * @param rate  通过比例
   * @param agreeCounter  通过计数器
   */
  private void testRate(Integer rate, Integer agreeCounter) throws Exception {
    // 部署流程
    String filePath = this.getClass().getClassLoader().getResource("diagrams/dispatch/dispatch.bpmn").getPath();
    FileInputStream inputStream = new FileInputStream(filePath);
    assertNotNull(inputStream);
    repositoryService.createDeployment().addInputStream("dispatch.bpmn20.xml", inputStream).deploy();

    // 启动流程
    Map<String, Object> variableMap = new HashMap<String, Object>();

    List<String> users = Arrays.asList("user1", "user2", "user3", "user4");
    variableMap.put("users", users);
    variableMap.put("rate", rate);

    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("dispatch", variableMap);
    assertNotNull(processInstance.getId());

    // 验证任务实例
    List<Task> list = taskService.createTaskQuery().list();
    assertEquals(users.size(), list.size());

    // 全部通过
    for (Task task : list) {
      try {
        taskService.complete(task.getId());
      } catch (Exception e) {
        // 其他的三个执行完成了，所以最后一个任务（也就是第4个）会报错任务不存在，因为剩下的任务由引擎自动完成了
        // e.printStackTrace();
      }
    }

    long count = historyService.createHistoricTaskInstanceQuery().finished().count();
    assertEquals(users.size(), count);

    assertEquals(agreeCounter, runtimeService.getVariable(processInstance.getId(), "agreeCounter"));

    // 验证是否到达“下发文件”节点
    Task sendTask = taskService.createTaskQuery().taskName("下发文件").singleResult();
    assertNotNull(sendTask);
  }

}
