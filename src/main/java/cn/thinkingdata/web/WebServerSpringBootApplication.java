package cn.thinkingdata.web;

import cn.thinkingdata.web.util.PropertiesUtil;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@MapperScan("cn.thinkingdata.web.persistence")
@EnableEurekaClient
public class WebServerSpringBootApplication {
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    @Value("${spring.datasource.url}")
    private String jdbcUrl;
    @Value("${spring.datasource.username}")
    private String dbUser;
    @Value("${spring.datasource.password}")
    private String dbPwd;

    public static void main(String[] args) {
        SpringApplication.run(WebServerSpringBootApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }


    //移植自原项目 applicationContext.xml PropertiesUtil
    @Bean
    PropertiesUtil PropertiesUtil() {
        PropertiesUtil propertiesUtil = new PropertiesUtil();

        propertiesUtil.setLocations(
                new ClassPathResource("configurations/jdbc.properties"),
                new ClassPathResource("configurations/redis.properties"),
                new ClassPathResource("configurations/rest.properties"),
                new ClassPathResource("configurations/table-flush-info.properties")
        );
        //下面这个函数在老的项目中没有调用，但是在spring boot中如果不调用的话就不能够运行
        //所报错误为，无法读取配置文件
        //看到博客上面说，如果需要自定义PropertyPlaceholderConfigurer，而项目中存在多个PropertyPlaceholderConfigurer
        //就需要调用下面的这个函数 http://blog.sina.com.cn/s/blog_5a15b7d10102w4k2.html
        propertiesUtil.setIgnoreUnresolvablePlaceholders(true);
        return propertiesUtil;
    }
}
