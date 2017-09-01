package cn.thinkingdata.web.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.FastJson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisShardInfo;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 28800,redisNamespace = "web_server_session")
public class RedisConfig extends CachingConfigurerSupport {
    protected static final Logger logger = LogManager.getLogger();

    @Value("${spring.redis.host}")
    protected String host;

    @Value("${spring.redis.port}")
    protected Integer port;

    @Value("${spring.redis.database}")
    protected Integer database;

    @Value("${spring.redis.timeout}")
    private Integer timeout;

    @Bean
    JedisShardInfo jedisShardInfo() {
        return new JedisShardInfo(host, port);
    }

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        JedisConnectionFactory jedisConnectionFactory = new JedisConnectionFactory();
        jedisConnectionFactory.setShardInfo(jedisShardInfo());
        jedisConnectionFactory.setDatabase(database);
        jedisConnectionFactory.setTimeout(timeout);
        return jedisConnectionFactory;
    }

    @Bean(name = "redisTemplate")
    public RedisTemplate redisTemplate() {
        logger.info("creating redisTemplate ********************************************");
        RedisTemplate template = new RedisTemplate();
        template.setConnectionFactory(jedisConnectionFactory());

        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        FastJson2JsonRedisSerializer fastJson2JsonRedisSerializer = new FastJson2JsonRedisSerializer();

        template.setKeySerializer(stringRedisSerializer);
        template.setValueSerializer(fastJson2JsonRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);
        template.setHashValueSerializer(fastJson2JsonRedisSerializer);
        return template;
    }

//    @Bean
//    StringRedisSerializer stringRedisSerializer() {
//        return new StringRedisSerializer();
//    }
//
//    @Bean
//    FastJson2JsonRedisSerializer fastJson2JsonRedisSerializer() {
//        return new FastJson2JsonRedisSerializer();
//    }

    @Bean
    @Override
    public CacheManager cacheManager() {
        RedisCacheManager redisCacheManager = new RedisCacheManager(redisTemplate());
        redisCacheManager.setDefaultExpiration(timeout);

        return redisCacheManager;
    }

    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object target, Method method, Object... objects) {
                StringBuilder sb = new StringBuilder();
                sb.append(target.getClass().getName()).append("-");
                sb.append(method.getName()).append(":");
                for (Object obj : objects) {
                    if (obj != null) {
                        sb.append(obj.toString());
                    } else {
                        sb.append("NULL");
                    }
                    sb.append("-");
                }
                if (objects.length > 0) {
                    sb.deleteCharAt(sb.length() - 1);
                }
                return sb.toString();
            }
        };
    }
}
