package cn.thinkingdata.web.config;

import cn.thinkingdata.web.filter.BindMobileFilter;
import cn.thinkingdata.web.filter.OperationFilter;
import cn.thinkingdata.web.filter.OutterGameAuthFilter;
import cn.thinkingdata.web.interceptor.EventInterceptor;
import cn.thinkingdata.web.interceptor.MaliciousRequestInterceptor;
import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.DispatcherServletAutoConfiguration;
import org.springframework.boot.autoconfigure.web.MultipartAutoConfiguration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.MultipartConfigElement;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class ApplicationConfig extends WebMvcConfigurerAdapter {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        super.configureMessageConverters(converters);

        FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter();
        FastJsonConfig fastJsonConfig = new FastJsonConfig();

        ArrayList<MediaType> mediaTypes = new ArrayList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON_UTF8);

        //在youzu中有着一句话,但是我看到 原项目 好像没有与之对应的地方,所以暂时注释
        //fastJsonConfig.getSerializeConfig().put(Json.class,SwaggerJsonSerializer.instance);
        fastJsonConfig.setFeatures(Feature.OrderedField);

        fastConverter.setSupportedMediaTypes(mediaTypes);
        fastConverter.setFastJsonConfig(fastJsonConfig);

        converters.add(fastConverter);
        
    }

    /**
     * 拦截器,对应于 原项目中的 spring-mvc.xml 中的拦截器,这里需要注意的是，并不能参照youzu直接
     * 将老项目迁移过来，因为
     * 1. youzu中只有一个EventInterceptor，而这里有两个Interceptor
     * 2. youzu中的EventInterceptor中使用的logger直接打印的信息，而老项目中使用的事sysEvent这样一个service打印的信息
     *
     * @param registry
     */
    @Autowired
    EventInterceptor eventInterceptor;
    @Autowired
    MaliciousRequestInterceptor maliciousRequestInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        maliciousRequestInterceptor.setNextInterceptor(eventInterceptor);

        registry.addInterceptor(maliciousRequestInterceptor).addPathPatterns("/**")
                .excludePathPatterns("/*.ico")
                .excludePathPatterns("/*/api-docs")
                .excludePathPatterns("/swagger**")
                .excludePathPatterns("/webjars/**")
                .excludePathPatterns("/configuration/**");

        //没有直接找到如何创建拦截器链,不过猜测这样先后添加的拦截器,应该自己会链接
        registry.addInterceptor(eventInterceptor).addPathPatterns("/**");
        super.addInterceptors(registry);
    }

    /**
     * 下面这两个函数为了实现将 spring mvc dispatcherServlet分别映射到两个不同的地方
     * 参考网址  http://www.jianshu.com/p/be2dafc8c644
     *
     * @return 这里的需求还是很奇怪的，在老项目中，由于使用spring mvc与Tomcat，静态资源的处理和动态Request请求是分离的，也就是说
     * tomcat在接收到一个请求的的时候会先去判断是不是对静态资源的请求，如果是的话就不会去将请求教给dispatchServlet来处理了。
     * 这也就解释了为什么老项目中 dispatchServlet映射到了/rest*,但是已经能够使用localhost:8080 访问到项目主页。
     * 但是在spring boot中，静态资源的处理和动态请求的处理是在同一个的框架下的，都是交给dispatchServlet来处理的，所以这里处理起来有点麻烦。
     * 目的是，在不想改动网页(html)源码的情况下，既需要能够通过localhost:8080 访问到主页，有需要 /rest/开头的api能够得到响应。
     * 通过查资料发现可以通过配置多个dispatchServlet来实现这个需求，下面这个函数配置了一个自定义的dispatchServlet，要注意这个自定义的
     * dispatchServlet     * 并不会覆盖掉spring boot框架提供的基础的dispatchServlet，也就是说我们通过spring boot提供的开箱机用的静态资源映射能够通过
     * localhost:8080直接访问到项目主页。同时需要注意的是 在存在多个dispatchServlet的时候，容器将会采用精准匹配的原则，也就是说，默认的
     * dispatchServlet映射到/*,自定义的dispatchServlet映射到了/rest/*下面，如果有一个请求是/rest/*(也算是/*)的话，将会交给
     * 我们自定义的dispatchServlet来处理。这样的话也就满足了老项目迁移带来的"很奇怪的"需求。
     */

    @Bean
    public ServletRegistrationBean dispatcherServletRegistration() {
        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        applicationContext.scan("cn.thinkingdata.web");
        DispatcherServlet dispatcherServlet = new DispatcherServlet(applicationContext);

        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(dispatcherServlet);
        servletRegistrationBean.addUrlMappings("/rest/*");
        servletRegistrationBean.addUrlMappings("/QQLoginCallbackServlet");
        servletRegistrationBean.setName("apiDispatchServlet");
        servletRegistrationBean.setLoadOnStartup(1);

        return servletRegistrationBean;
    }


    /**
     * 下面这三个函数的作用是添加了三个自定义的filter , 具体的含义暂时不清楚, 只是按照spring boot框架照搬了原来的东西
     * 需要注意的是这里需要使用@Bean生成三个filter的实例,而不是使用new新建对象.
     * 因为自定义的filter都是用到了@Autowired , 所以这里不能使用new
     *
     * @return
     */
    @Bean
    public FilterRegistrationBean bindMobileFilterRegistration() {

        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        filterRegistration.setFilter(bindMobileFilter());
        filterRegistration.setEnabled(true);
        filterRegistration.addUrlPatterns("/rest/v1/service/*");
        filterRegistration.setName("bindMobileFilter");
        return filterRegistration;
    }

    @Bean
    public Filter bindMobileFilter() {
        return new BindMobileFilter();
    }

    @Bean
    public FilterRegistrationBean operationFilterRegistration() {

        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        filterRegistration.setFilter(operationFilter());
        filterRegistration.setFilter(operationFilter());
        filterRegistration.setEnabled(true);
        filterRegistration.addUrlPatterns("/rest/v1/service/inner/*");
        filterRegistration.setName("operationFilter");
        return filterRegistration;
    }

    @Bean
    public Filter operationFilter() {
        return new OperationFilter();
    }

    @Bean
    public FilterRegistrationBean outterGameAuthFilterRegistration() {

        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        filterRegistration.setFilter(outterGameAuthFilter());
        filterRegistration.setEnabled(true);
        filterRegistration.addUrlPatterns("/rest/v1/service/outer/reputation/*");
        filterRegistration.addUrlPatterns("/rest/v1/forum/*");
        filterRegistration.addUrlPatterns("/rest/v1/channel/*");
        filterRegistration.addUrlPatterns("/rest/v1/service/profile/*");
        filterRegistration.addUrlPatterns("/rest/v1/service/sigma/*");
        filterRegistration.addUrlPatterns("/rest/v1/service/opinionmonitor/*");
        filterRegistration.setName("outterGameAuthFilter");
        return filterRegistration;
    }

    @Bean
    public Filter outterGameAuthFilter() {
        return new OutterGameAuthFilter();
    }
}
