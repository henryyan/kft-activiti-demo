package me.kafeitu.demo.activiti.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.DefaultPropertiesPersister;
import org.springframework.util.PropertiesPersister;

/**
 * 系统属性工具类
 *
 * @author HenryYan
 *
 */
public class PropertyFileUtil {

    private static Logger logger = LoggerFactory.getLogger(PropertyFileUtil.class);

    private static Properties properties;

    private static PropertiesPersister propertiesPersister = new DefaultPropertiesPersister();
    private static ResourceLoader resourceLoader = new DefaultResourceLoader();
    private static final String DEFAULT_ENCODING = "UTF-8";

    /**
     * 初始化读取配置文件，读取的文件列表位于classpath下面的application-files.properties<br/>
     *
     * 多个配置文件会用最后面的覆盖相同属性值
     *
     * @throws IOException	读取属性文件时
     */
    public static void init() throws IOException {
        String fileNames = "application-files.properties";
        innerInit(fileNames);
    }

    /**
     * 初始化读取配置文件，读取的文件列表位于classpath下面的application-[type]-files.properties<br/>
     *
     * 多个配置文件会用最后面的覆盖相同属性值
     *
     * @param type 配置文件类型，application-[type]-files.properties
     *
     * @throws IOException	读取属性文件时
     */
    public static void init(String type) throws IOException {
        String fileNames = "application-" + type + "-files.properties";
        innerInit(fileNames);
    }

    /**
     * 内部处理
     * @param fileNames
     * @throws IOException
     */
    private static void innerInit(String fileNames) throws IOException {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        InputStream resourceAsStream = loader.getResourceAsStream(fileNames);

        // 默认的Properties实现使用HashMap算法，为了保持原有顺序使用有序Map
        Properties files = new LinkedProperties();
        files.load(resourceAsStream);

        Set<Object> fileKeySet = files.keySet();
        String[] propFiles = new String[fileKeySet.size()];
        List<Object> fileList = new ArrayList<Object>();

        fileList.addAll(files.keySet());
        for (int i = 0; i < propFiles.length; i++) {
            String fileKey = fileList.get(i).toString();
            propFiles[i] = files.getProperty(fileKey);
        }

        logger.debug("读取属性文件：{}", ArrayUtils.toString(propFiles));;
        properties = loadProperties(propFiles);
        Set<Object> keySet = properties.keySet();
        for (Object key : keySet) {
            logger.debug("property: {}, value: {}", key, properties.getProperty(key.toString()));
        }
    }

    /**
     * 载入多个properties文件, 相同的属性在最后载入的文件中的值将会覆盖之前的载入.
     * 文件路径使用Spring Resource格式, 文件编码使用UTF-8.
     *
     * @see org.springframework.beans.factory.config.PropertyPlaceholderConfigurer
     */
    public static Properties loadProperties(String... resourcesPaths) throws IOException {
        Properties props = new Properties();

        for (String location : resourcesPaths) {

            logger.debug("Loading properties file from:" + location);

            InputStream is = null;
            try {
                Resource resource = resourceLoader.getResource(location);
                is = resource.getInputStream();
                propertiesPersister.load(props, new InputStreamReader(is, DEFAULT_ENCODING));
            } catch (IOException ex) {
                logger.info("Could not load properties from classpath:" + location + ": " + ex.getMessage());
            } finally {
                if (is != null) {
                    is.close();
                }
            }
        }
        return props;
    }

    /**
     * 获取所有的key
     * @return
     */
    public static Set<String> getKeys() {
        return properties.stringPropertyNames();
    }

    /**
     * 获取键值对Map
     * @return
     */
    public static Map<String, String> getKeyValueMap() {
        Set<String> keys = getKeys();
        Map<String, String> values = new HashMap<String, String>();
        for (String key : keys) {
            values.put(key, get(key));
        }
        return values;
    }

    /**
     * 获取属性值
     * @param key	键
     * @return	值
     */
    public static String get(String key) {
        String propertyValue = properties.getProperty(key);
        logger.debug("获取属性：{}，值：{}", key, propertyValue);
        return propertyValue;
    }

    /**
     * 获取属性值
     * @param key	键
     * @param defaultValue	默认值
     * @return	值
     */
    public static String get(String key, String defaultValue) {
        String propertyValue = properties.getProperty(key);
        String value = StringUtils.defaultString(propertyValue, defaultValue);
        logger.debug("获取属性：{}，值：{}", key, value);
        return value;
    }

    /**
     * 向内存添加属性
     * @param key		键
     * @param value		值
     */
    public static void add(String key, String value) {
        properties.put(key, value);
        logger.debug("通过方法添加属性到内存：{}，值：{}", key, value);
    }
}