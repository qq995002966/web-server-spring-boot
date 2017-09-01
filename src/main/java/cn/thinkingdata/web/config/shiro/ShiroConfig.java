package cn.thinkingdata.web.config.shiro;

import org.apache.shiro.codec.Base64;
import org.apache.shiro.mgt.RememberMeManager;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.mgt.DefaultSessionManager;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.apache.shiro.session.mgt.eis.JavaUuidSessionIdGenerator;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.apache.shiro.session.mgt.eis.SessionIdGenerator;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.mgt.CookieRememberMeManager;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.ShiroFilter;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.filter.DelegatingFilterProxy;

import javax.servlet.DispatcherType;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class ShiroConfig {

    @Bean
    public FilterRegistrationBean shirlFilterRegistrationBean() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        DelegatingFilterProxy proxy = new DelegatingFilterProxy();
        proxy.setTargetBeanName("shiroFilter");
        proxy.setTargetFilterLifecycle(true);

        registrationBean.setFilter(proxy);
        registrationBean.setEnabled(true);
        registrationBean.addUrlPatterns("/rest/*");
        registrationBean.addUrlPatterns("/QQLoginCallbackServlet");
        registrationBean.setDispatcherTypes(DispatcherType.REQUEST);

        //这里是个大坑
        //如果不在这里设置order为1的话，BindMobileFilter中使用到SecurityUtil的地方都不能够正常运行，
        //也就是说需要让shiroFilter处于最外边,但是直接使用ShiroFacutoryBean的话,是不能够自定义filter的order的
        //所以这里只能使用DelegatingFilterProxy了,如果找到什么好方法将会在这里修改
        registrationBean.setOrder(1);
        //这里是另一个大坑
        //如果不设置名字的话,会使用filter的名字,由于我们使用的是DelegatingFilterProxy,也就是会使用
        //delegatingFilterProxy作为name,这样的话,其他地方也使用到了DelegatingFilterProxy,
        //就会覆盖,从而出错.
        //但是这样的话会出现注册两次shiroFilter的情况,看着有点膈应.不过幸好第二次注册的并不会起作用
        registrationBean.setName("shiroFilter");

        return registrationBean;
    }

    @Bean(name = "realm")
    @DependsOn("lifecycleBeanPostProcessor")
    public Realm realm() {
        final Realm realm = new cn.thinkingdata.web.shiro.Realm();
        return realm;
    }

    @Bean
    public SimpleCookie rememberMeCookie() {
        SimpleCookie rememberMeCookie = new SimpleCookie("rememberMe");
        rememberMeCookie.setHttpOnly(true);
        rememberMeCookie.setMaxAge(604800); //30 day
        return rememberMeCookie;
    }

    @Bean
    public CookieRememberMeManager rememberMeManager(@Qualifier("rememberMeCookie")SimpleCookie rememberMeCookie) {
        CookieRememberMeManager rememberMeManager = new CookieRememberMeManager();
        rememberMeManager.setCipherKey(Base64.decode("4AvVhmFLUs0KTA3Kprsdag=="));
        rememberMeManager.setCookie(rememberMeCookie);
        return rememberMeManager;
    }

    @Bean(name = "securityManager")
    public SecurityManager securityManager(@Qualifier("realm") Realm realm,
                                           @Qualifier("rememberMeManager") RememberMeManager rememberMeManager) {
        final DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(realm);
        securityManager.setRememberMeManager(rememberMeManager);
        return securityManager;
    }

    //原项目中还有这样的一行字,在youzu中没有找到对应的代码,姑且暂时不迁移过来了
//    <bean class="org.springframework.beans.factory.config.MethodInvokingFactoryBean">
//        <property name="staticMethod" value="org.apache.shiro.SecurityUtils.setSecurityManager"/>
//        <property name="arguments" ref="securityManager"/>
//    </bean>

    @Bean
    public FormAuthenticationFilter formAuthenticationFilter() {
        FormAuthenticationFilter formAuthenticationFilter = new FormAuthenticationFilter();
        formAuthenticationFilter.setUsernameParam("username");
        formAuthenticationFilter.setPasswordParam("password");
        formAuthenticationFilter.setRememberMeParam("rememberMe");
        return formAuthenticationFilter;
    }

    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean shiroFilter(@Qualifier("securityManager") SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        Map<String, String> filterChainMap = new HashMap<>();

        filterChainMap.put("/QQLoginCallbackServlet", "anon");
        filterChainMap.put("/rest/v1/activity/**", "anon");
        filterChainMap.put("/rest/v1/article/**", "anon");
        filterChainMap.put("/rest/v1/login/**", "anon");
        filterChainMap.put("/rest/v1/gas/**", "anon");
        filterChainMap.put("/rest/v1/geetest/**", "anon");
        filterChainMap.put("/rest/v1/industry/**", "anon");
        filterChainMap.put("/rest/v1/operation/**", "anon");
        filterChainMap.put("/rest/v1/demo/**", "anon");
        filterChainMap.put("/rest/v1/item/**", "anon");
        filterChainMap.put("/rest/v1/channel/**", "anon");
        filterChainMap.put("/rest/v1/forum/**", "anon");
        filterChainMap.put("/rest/v1/lt/**", "anon");
        filterChainMap.put("/rest/v1/home/**", "anon");
        filterChainMap.put("/rest/v1/project/**", "anon");
        filterChainMap.put("/rest/v1/outer/**", "anon");
        filterChainMap.put("/rest/v1/user/**", "anon");
        filterChainMap.put("/rest/v1/unauthorized", "anon");
        filterChainMap.put("/rest/v1/oss/chat_callback", "anon");
        filterChainMap.put("/rest/v1/**", "user");

        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainMap);
        shiroFilterFactoryBean.setLoginUrl("/v1/home/unauthorized");
        shiroFilterFactoryBean.setUnauthorizedUrl("/v1/home/forbidden");

        return shiroFilterFactoryBean;
    }

    @Bean
    public SessionManager sessionManager() {
        DefaultSessionManager defaultSessionManager = new DefaultSessionManager();
        defaultSessionManager.setGlobalSessionTimeout(6400000);
        defaultSessionManager.setDeleteInvalidSessions(true);
        defaultSessionManager.setSessionValidationSchedulerEnabled(true);
        defaultSessionManager.setSessionDAO(sessionDAO());
//        defaultSessionManager.setSessionIDCookieEnable(true);在原项目 有这样一行,但是这里好像没有这个函数?
        return defaultSessionManager;
    }

    @Bean
    public SessionDAO sessionDAO() {
        EnterpriseCacheSessionDAO sessionDAO = new EnterpriseCacheSessionDAO();
        sessionDAO.setActiveSessionsCacheName("shiro-activeSessionCache");
        sessionDAO.setSessionIdGenerator(sessionIdGenerator());
        return sessionDAO;
    }

    @Bean
    public SessionIdGenerator sessionIdGenerator() {
        return new JavaUuidSessionIdGenerator();
    }

    @Bean
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

}
