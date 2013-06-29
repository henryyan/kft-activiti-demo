package me.kafeitu.modules.web.servlet;

import java.io.IOException;
import java.util.Set;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import me.kafeitu.demo.activiti.util.PropertyFileUtil;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * classpath下面的属性配置文件读取初始化类
 */
public class PropertiesServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PropertiesServlet() {
		super();
	}

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		try {
			PropertyFileUtil.init();
            ServletContext servletContext = config.getServletContext();
            setParameterToServerContext(servletContext);;
			logger.info("++++ 初始化[classpath下面的属性配置文件]完成 ++++");
		} catch (IOException e) {
			logger.error("初始化classpath下的属性文件失败", e);
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String action = StringUtils.defaultString(req.getParameter("action"));
		resp.setContentType("text/plain;charset=UTF-8");
		if ("reload".equals(action)) { // 重载
			try {
				PropertyFileUtil.init();
                setParameterToServerContext(req.getSession().getServletContext());
				logger.info("++++ 重新初始化[classpath下面的属性配置文件]完成 ++++，{IP={}}", req.getRemoteAddr());
				resp.getWriter().print("<b>属性文件重载成功！</b><br/>");
				writeProperties(resp);
			} catch (IOException e) {
				logger.error("重新初始化classpath下的属性文件失败", e);
			}
		} else if ("getprop".equals(action)) { // 获取属性
			String key = StringUtils.defaultString(req.getParameter("key"));
			resp.getWriter().print(key + "=" + PropertyFileUtil.get(key));
		} else if ("list".equals(action)) { // 获取属性
			writeProperties(resp);
		}
	}

    private void setParameterToServerContext(ServletContext servletContext) {
        servletContext.setAttribute("prop", PropertyFileUtil.getKeyValueMap());
    }

	/**
	 * 输出属性以及值列表到页面
	 * @param resp
	 * @throws IOException
	 */
	protected void writeProperties(HttpServletResponse resp) throws IOException {
		Set<String> keys = PropertyFileUtil.getKeys();
		StringBuilder sb = new StringBuilder();
		for (Object key : keys) {
			sb.append(key + "<span style='color:red;font-weight:bold;'>=</span>" + PropertyFileUtil.get(key.toString()) + "<br/>");
		}
		resp.setContentType("text/html");
		resp.getWriter().print("<html><body>" + sb.toString() + "</body></html>");
	}

}
