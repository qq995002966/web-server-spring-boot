//package cn.thinkingdata.web.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//import springfox.documentation.builders.ApiInfoBuilder;
//import springfox.documentation.builders.PathSelectors;
//import springfox.documentation.service.ApiInfo;
//import springfox.documentation.service.Contact;
//import springfox.documentation.spi.DocumentationType;
//import springfox.documentation.spring.web.plugins.Docket;
//import springfox.documentation.swagger.web.UiConfiguration;
//import springfox.documentation.swagger2.annotations.EnableSwagger2;
//
//
///**
// * @author Carpenter
// * @date 2017/1/6 15:12
// * @description SwaggerConfig
// */
//@Configuration
//@EnableWebMvc
//@EnableSwagger2
//public class SwaggerConfig {
//
//    @Bean
//    public Docket createRestApi() {
//        return new Docket(DocumentationType.SWAGGER_2)
//                .apiInfo(apiInfo())
//                .select()
//                .paths(PathSelectors.any())
//                .build();
//    }
//
//    private ApiInfo apiInfo() {
//        return new ApiInfoBuilder()
//                .title("ThinkingGame RESTful APIs")
//                .description("ThinkingGame 中使用Swagger2构建RESTful APIs")
//                .termsOfServiceUrl("https://wetts.github.io/")
//                .contact(new Contact("guoxw", "", "guoxw@thinkingdata.cn"))
//                .version("1.0")
//                .build();
//    }
//}
