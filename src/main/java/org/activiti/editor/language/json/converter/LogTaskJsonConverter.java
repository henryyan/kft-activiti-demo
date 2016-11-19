/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.activiti.editor.language.json.converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.activiti.bpmn.model.BaseElement;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.ServiceTask;

import java.util.Map;

/**
 * @author Henry Yan
 */
public class LogTaskJsonConverter extends BaseBpmnJsonConverter {

    public static final String LOG_TASK = "LogTask";

    public static void fillTypes(Map<String, Class<? extends BaseBpmnJsonConverter>> convertersToBpmnMap,
                                 Map<Class<? extends BaseElement>, Class<? extends BaseBpmnJsonConverter>> convertersToJsonMap) {

        fillJsonTypes(convertersToBpmnMap);
        fillBpmnTypes(convertersToJsonMap);
    }

    public static void fillJsonTypes(Map<String, Class<? extends BaseBpmnJsonConverter>> convertersToBpmnMap) {
        convertersToBpmnMap.put(LOG_TASK, LogTaskJsonConverter.class);
    }

    public static void fillBpmnTypes(Map<Class<? extends BaseElement>, Class<? extends BaseBpmnJsonConverter>> convertersToJsonMap) {
        // will be handled by ServiceTaskJsonConverter
    }

    protected String getStencilId(BaseElement baseElement) {
        return LOG_TASK;
    }

    protected void convertElementToJson(ObjectNode propertiesNode, BaseElement baseElement) {
        // will be handled by ServiceTaskJsonConverter
    }

    protected FlowElement convertJsonToElement(JsonNode elementNode, JsonNode modelNode, Map<String, JsonNode> shapeMap) {
        ServiceTask task = new ServiceTask();
        task.setType("log");

        // 这里注意: 不要用三个参数的addField方法(这个方法会固定截取前8个字符,logtaskct截取后只剩下字符t)
        addField("content", "logtaskct", elementNode, task);

        return task;
    }
}
