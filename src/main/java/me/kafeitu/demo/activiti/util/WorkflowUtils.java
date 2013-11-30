package me.kafeitu.demo.activiti.util;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * @author HenryYan
 */
public class WorkflowUtils {

    private static Logger logger = LoggerFactory.getLogger(WorkflowUtils.class);

    /**
     * 转换流程节点类型为中文说明
     *
     * @param type 英文名称
     * @return 翻译后的中文名称
     */
    public static String parseToZhType(String type) {
        Map<String, String> types = new HashMap<String, String>();
        types.put("userTask", "用户任务");
        types.put("serviceTask", "系统任务");
        types.put("startEvent", "开始节点");
        types.put("endEvent", "结束节点");
        types.put("exclusiveGateway", "条件判断节点(系统自动根据条件处理)");
        types.put("inclusiveGateway", "并行处理任务");
        types.put("callActivity", "子流程");
        return types.get(type) == null ? type : types.get(type);
    }

    /**
     * 导出图片文件到硬盘
     *
     * @return 文件的全路径
     */
    public static String exportDiagramToFile(RepositoryService repositoryService, ProcessDefinition processDefinition, String exportDir) throws IOException {
        String diagramResourceName = processDefinition.getDiagramResourceName();
        String key = processDefinition.getKey();
        int version = processDefinition.getVersion();
        String diagramPath = "";

        InputStream resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(), diagramResourceName);
        byte[] b = new byte[resourceAsStream.available()];

        @SuppressWarnings("unused")
        int len = -1;
        resourceAsStream.read(b, 0, b.length);

        // create file if not exist
        String diagramDir = exportDir + "/" + key + "/" + version;
        File diagramDirFile = new File(diagramDir);
        if (!diagramDirFile.exists()) {
            diagramDirFile.mkdirs();
        }
        diagramPath = diagramDir + "/" + diagramResourceName;
        File file = new File(diagramPath);

        // 文件存在退出
        if (file.exists()) {
            // 文件大小相同时直接返回否则重新创建文件(可能损坏)
            logger.debug("diagram exist, ignore... : {}", diagramPath);
            return diagramPath;
        } else {
            file.createNewFile();
        }

        logger.debug("export diagram to : {}", diagramPath);

        // wirte bytes to file
        FileUtils.writeByteArrayToFile(file, b, true);
        return diagramPath;
    }

}
