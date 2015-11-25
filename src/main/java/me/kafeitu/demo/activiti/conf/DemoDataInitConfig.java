package me.kafeitu.demo.activiti.conf;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import javax.annotation.PostConstruct;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import me.kafeitu.demo.activiti.util.PropertyFileUtil;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.Picture;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.util.IoUtil;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 自动初始化演示数据
 *
 * @author Henry Yan
 */
@Component
public class DemoDataInitConfig {

    protected static final Logger LOGGER = LoggerFactory.getLogger(DemoDataInitConfig.class);

    @Autowired
    protected IdentityService identityService;

    @Autowired
    protected RepositoryService repositoryService;

    @Autowired
    protected RuntimeService runtimeService;

    @Autowired
    protected TaskService taskService;

    @Autowired
    protected ManagementService managementService;

    @Autowired
    protected ProcessEngineConfigurationImpl processEngineConfiguration;

    @PostConstruct
    public void init() {

        try {
            PropertyFileUtil.init();
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (Boolean.valueOf(PropertyFileUtil.get("create.demo.users", "true"))) {
            LOGGER.info("Initializing demo groups");
            initDemoGroups();
            LOGGER.info("Initializing demo users");
            initDemoUsers();
        }

        if (Boolean.valueOf(PropertyFileUtil.get("create.demo.definitions", "true"))) {
            LOGGER.info("Initializing demo process definitions");
            initProcessDefinitions();
        }

        if (Boolean.valueOf(PropertyFileUtil.get("create.demo.models", "true"))) {
            LOGGER.info("Initializing demo models");
            initModelData();
        }
    }

    protected void initDemoGroups() {
        String[] assignmentGroups = new String[]{"deptLeader", "hr"};
        for (String groupId : assignmentGroups) {
            createGroup(groupId, "assignment");
        }

        String[] securityGroups = new String[]{"user", "admin"};
        for (String groupId : securityGroups) {
            createGroup(groupId, "security-role");
        }
    }

    protected void createGroup(String groupId, String type) {
        if (identityService.createGroupQuery().groupId(groupId).count() == 0) {
            Group newGroup = identityService.newGroup(groupId);
            newGroup.setName(groupId.substring(0, 1).toUpperCase() + groupId.substring(1));
            newGroup.setType(type);
            identityService.saveGroup(newGroup);
        }
    }

    protected void initDemoUsers() {
        createUser("admin", "Henry", "Yan", "000000", "henry.yan@kafeitu.me",
                "", Arrays.asList("user", "admin"), null);

        createUser("hruser", "Lili", "Zhang", "000000", "lili.zhang@kafeitu.me",
                "", Arrays.asList("hr", "user"), null);

        createUser("leaderuser", "Jhon", "Li", "000000", "jhon.li@kafeitu.me",
                "", Arrays.asList("deptLeader", "user"), null);

        createUser("kafeitu", "Coffee", "Rabbit", "000000", "coffee.rabbit@kafeitu.me",
                "", Arrays.asList("user", "admin"), null);
    }

    protected void createUser(String userId, String firstName, String lastName, String password,
                              String email, String imageResource, List<String> groups, List<String> userInfo) {

        if (identityService.createUserQuery().userId(userId).count() == 0) {

            // Following data can already be set by demo setup script

            User user = identityService.newUser(userId);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword(password);
            user.setEmail(email);
            identityService.saveUser(user);

            if (groups != null) {
                for (String group : groups) {
                    identityService.createMembership(userId, group);
                }
            }
        }

        // Following data is not set by demo setup script

        // image
        if (imageResource != null) {
            byte[] pictureBytes = IoUtil.readInputStream(this.getClass().getClassLoader().getResourceAsStream(imageResource), null);
            Picture picture = new Picture(pictureBytes, "image/jpeg");
            identityService.setUserPicture(userId, picture);
        }

        // user info
        if (userInfo != null) {
            for (int i = 0; i < userInfo.size(); i += 2) {
                identityService.setUserInfo(userId, userInfo.get(i), userInfo.get(i + 1));
            }
        }

    }

    protected void initProcessDefinitions() {

        String deploymentName = "Demo processes";
        List<Deployment> deploymentList = repositoryService.createDeploymentQuery().deploymentName(deploymentName).list();

        if (deploymentList == null || deploymentList.isEmpty()) {
            repositoryService.createDeployment()
                    .name(deploymentName)
                    .addClasspathResource("diagrams/leave/leave.bpmn")
                    .addClasspathResource("diagrams/leave/leave.png")
                    .deploy();
        }
    }

    protected void initModelData() {
        createModelData("Demo model", "This is a demo model", "models/leave.model.json");
    }

    protected void createModelData(String name, String description, String jsonFile) {
        List<Model> modelList = repositoryService.createModelQuery().modelName("Demo model").list();

        if (modelList == null || modelList.isEmpty()) {

            Model model = repositoryService.newModel();
            model.setName(name);

            ObjectNode modelObjectNode = new ObjectMapper().createObjectNode();
            modelObjectNode.put("name", name);
            modelObjectNode.put("description", description);
            model.setMetaInfo(modelObjectNode.toString());

            repositoryService.saveModel(model);

            try {
                InputStream svgStream = this.getClass().getClassLoader().getResourceAsStream("models/leave.model.svg");
                repositoryService.addModelEditorSourceExtra(model.getId(), IOUtils.toByteArray(svgStream));
            } catch (Exception e) {
                LOGGER.warn("Failed to read SVG", e);
            }

            try {
                InputStream editorJsonStream = this.getClass().getClassLoader().getResourceAsStream(jsonFile);
                repositoryService.addModelEditorSource(model.getId(), IOUtils.toByteArray(editorJsonStream));
            } catch (Exception e) {
                LOGGER.warn("Failed to read editor JSON", e);
            }
        }
    }
}