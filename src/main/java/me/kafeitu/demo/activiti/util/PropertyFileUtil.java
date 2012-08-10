package me.kafeitu.demo.activiti.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import me.kafeitu.modules.utils.PropertiesLoader;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 系统属性工具类
 *
 * @author HenryYan
 *
 */
public class PropertyFileUtil {
	
	private static Logger logger = LoggerFactory.getLogger(PropertyFileUtil.class);
	
	private static Properties properties;
	
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
		
		Properties files = new Properties();
		files.load(resourceAsStream);
		
		Set<Object> fileKeySet = files.keySet();
		String[] propFiles = new String[fileKeySet.size()];
		List<Object> fileList = new ArrayList<Object>();
		
		fileList.addAll(files.keySet());
		for (int i = 0; i < propFiles.length; i++) {
			String fileKey = fileList.get(i).toString();
			
			// 倒序加入到数组中，按照配置文件中的顺序覆盖相同名字的变量
			propFiles[propFiles.length - i - 1] = files.getProperty(fileKey);
		}
		
		logger.debug("读取属性文件：{}", propFiles);
		PropertiesLoader propertiesLoader = new PropertiesLoader(propFiles);
		properties = propertiesLoader.getProperties();
		Set<Object> keySet = properties.keySet();
		for (Object key : keySet) {
			logger.debug("property: {}, value: {}", key, properties.getProperty(key.toString()));
		}
	}
	
	/**
	 * 获取所有的key
	 * @return
	 */
	public static Set<Object> getKeys() {
		return properties.keySet();
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
