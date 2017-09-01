package cn.thinkingdata.web.properties;

import org.springframework.context.annotation.PropertySource;

import java.util.ResourceBundle;

/**
 * 加载配置
 *
 * Created by Xiaowu on 2016/6/25.
 */
@PropertySource(value = { "classpath:wxconnectconfig.properties" })
public final class Resources {
    public static final ResourceBundle WEIXIN =  ResourceBundle.getBundle("wxconnectconfig");
}
