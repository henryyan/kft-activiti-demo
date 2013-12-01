package me.kafeitu.demo.activiti.util;

import com.google.common.collect.Maps;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.lang3.ObjectUtils;

import java.util.List;
import java.util.Map;

/**
 * 流程定义缓存
 *
 * @author henryyan
 */
public class ProcessDefinitionCache {

    private static Map<String, ProcessDefinition> map = Maps.newHashMap();

    private static Map<String, List<ActivityImpl>> activities = Maps.newHashMap();

    private static Map<String, ActivityImpl> singleActivity = Maps.newHashMap();

    private static RepositoryService repositoryService;

    public static ProcessDefinition get(String processDefinitionId) {
        ProcessDefinition processDefinition = map.get(processDefinitionId);
        if (processDefinition == null) {
            processDefinition = (ProcessDefinitionEntity) ((RepositoryServiceImpl) repositoryService).getDeployedProcessDefinition(processDefinitionId);
            if (processDefinition != null) {
                put(processDefinitionId, processDefinition);
            }
        }
        return processDefinition;
    }

    public static void put(String processDefinitionId, ProcessDefinition processDefinition) {
        map.put(processDefinitionId, processDefinition);
        ProcessDefinitionEntity pde = (ProcessDefinitionEntity) processDefinition;
        activities.put(processDefinitionId, pde.getActivities());
        for (ActivityImpl activityImpl : pde.getActivities()) {
            singleActivity.put(processDefinitionId + "_" + activityImpl.getId(), activityImpl);
        }
    }

    public static ActivityImpl getActivity(String processDefinitionId, String activityId) {
        ProcessDefinition processDefinition = get(processDefinitionId);
        if (processDefinition != null) {
            ActivityImpl activityImpl = singleActivity.get(processDefinitionId + "_" + activityId);
            if (activityImpl != null) {
                return activityImpl;
            }
        }
        return null;
    }

    public static String getActivityName(String processDefinitionId, String activityId) {
        ActivityImpl activity = getActivity(processDefinitionId, activityId);
        if (activity != null) {
            return ObjectUtils.toString(activity.getProperty("name"));
        }
        return null;
    }

    public static void setRepositoryService(RepositoryService repositoryService) {
        ProcessDefinitionCache.repositoryService = repositoryService;
    }

}
