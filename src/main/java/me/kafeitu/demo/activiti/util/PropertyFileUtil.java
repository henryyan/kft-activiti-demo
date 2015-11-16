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
 */
public class PropertyFileUtil {

    private static final String DEFAULT_ENCODING = "UTF-8";
    private static Logger logger = LoggerFactory.getLogger(PropertyFileUtil.class);
    private static Properties properties;
    private static PropertiesPersister propertiesPersister = new DefaultPropertiesPersister();
    private static ResourceLoader resourceLoader = new DefaultResourceLoader();
    private static Properties activePropertyFiles = null;
    private static String PROFILE_ID = StringUtils.EMPTY;
    public static boolean initialized = false; // 是否已初始化

    /**
     * 初始化读取配置文件，读取的文件列表位于classpath下面的application-files.properties<br/>
     * <p/>
     * 多个配置文件会用最后面的覆盖相同属性值
     *
     * @throws IOException 读取属性文件时
     */
    public static void init() throws IOException {
        String fileNames = "application-files.properties";
        PROFILE_ID = StringUtils.EMPTY;
        innerInit(fileNames);
        activePropertyFiles(fileNames);
        initialized = true;
    }

    /**
     * 初始化读取配置文件，读取的文件列表位于classpath下面的application-[type]-files.properties<br/>
     * <p/>
     * 多个配置文件会用最后面的覆盖相同属性值
     *
     * @param profile 配置文件类型，application-[profile]-files.properties
     * @throws IOException 读取属性文件时
     */
    public static void init(String profile) throws IOException {
        if (StringUtils.isBlank(profile)) {
            init();
        } else {
            PROFILE_ID = profile;
            String fileNames = "application-" + profile + "-files.properties";
            innerInit(fileNames);
        }
        initialized = true;
    }

    /**
     * 内部处理
     *
     * @param fileName
     * @throws IOException
     */
    private static void innerInit(String fileName) throws IOException {
        String[] propFiles = activePropertyFiles(fileName);
        logger.debug("读取属性文件：{}", ArrayUtils.toString(propFiles));
        properties = loadProperties(propFiles);
        Set<Object> keySet = properties.keySet();
        for (Object key : keySet) {
            logger.debug("property: {}, value: {}", key, properties.getProperty(key.toString()));
        }
    }

    /**
     * 获取读取的资源文件列表
     *
     * @param fileName
     * @return
     * @throws IOException
     */
    private static String[] activePropertyFiles(String fileName) throws IOException {
        logger.info("读取" + fileName);
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        InputStream resourceAsStream = loader.getResourceAsStream(fileName);
        // 默认的Properties实现使用HashMap算法，为了保持原有顺序使用有序Map
        activePropertyFiles = new LinkedProperties();
        activePropertyFiles.load(resourceAsStream);

        Set<Object> fileKeySet = activePropertyFiles.keySet();
        String[] propFiles = new String[fileKeySet.size()];
        List<Object> fileList = new ArrayList<Object>();

        fileList.addAll(activePropertyFiles.keySet());
        for (int i = 0; i < propFiles.length; i++) {
            String fileKey = fileList.get(i).toString();
            propFiles[i] = activePropertyFiles.getProperty(fileKey);
        }
        return propFiles;
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

            // 剔除classpath路径协议
            location = location.replace("classpath*:/", "");

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
     *
     * @return
     */
    public static Set<String> getKeys() {
        return properties.stringPropertyNames();
    }

    /**
     * 获取键值对Map
     *
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
     *
     * @param key 键
     * @return 值
     */
    public static String get(String key) {
        if (!initialized) {
            try {
                init();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        String propertyValue = properties.getProperty(key);
        if (logger.isDebugEnabled()) {
            logger.debug("获取属性：{}，值：{}", key, propertyValue);
        }
        return propertyValue;
    }

    /**
     * 获取属性值
     *
     * @param key          键
     * @param defaultValue 默认值
     * @return 值
     */
    public static String get(String key, String defaultValue) {
        if (!initialized) {
            try {
                init();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        String propertyValue = properties.getProperty(key);
        String value = StringUtils.defaultString(propertyValue, defaultValue);
        if (logger.isDebugEnabled()) {
            logger.debug("获取属性：{}，值：{}", key, value);
        }
        return value;
    }

    /**
     * 判断key对应的value是否和期待的一致
     * @param key
     * @param expectValue
     * @return
     */
    public static boolean equalsWith(String key, String expectValue) {
        String value = get(key);
        return StringUtils.equals(value, expectValue);
    }

    /**
     * 向内存添加属性
     *
     * @param key   键
     * @param value 值
     */
    public static void add(String key, String value) {
        properties.put(key, value);
        logger.debug("通过方法添加属性到内存：{}，值：{}", key, value);
    }

    public static Properties getActivePropertyFiles() {
        return activePropertyFiles;
    }

    public static String getProfile() {
        return PROFILE_ID;
    }
}